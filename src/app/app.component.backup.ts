import { Component, SystemJsNgModuleLoader } from '@angular/core';
import { Inject } from '@angular/core';
import { OAuthService } from './services/salesforce-oauth-service';
import { DataService } from './services/salesforce-data-service';
import { OfficeDataService } from './services/office-data-service';
import { ExcelService } from './services/excel-service';

import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { environment } from '../environments/environment';
import { APP_BASE_HREF } from '@angular/common';
import { NgZone } from '@angular/core';
import { QUERIES } from '@angular/core/src/render3/interfaces/view';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';


declare const Excel: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.backup.html'
})

export class AppComponent {
  isLoggedIn = false;
  objects = [];
  queries = [];
  openSave = false;
  openQueries = false;

  queryForm = new FormGroup({
    label: new FormControl(''),
    soql: new FormControl(''),
    object: new FormControl(''),
    fields: new FormArray([]),
    customurl: new FormControl(''),
    search: new FormControl(''),
    selectedonly: new FormControl()
  });

  constructor(
    private authService: OAuthService,
    private ngZone: NgZone,
    private dataService: DataService,
    private officeService: OfficeDataService,
    private excelService: ExcelService,
    private formBuilder: FormBuilder,
    @Inject(APP_BASE_HREF) private baseHref: string) {

  }
  searchchanged() {
    console.log(this.queryForm.value.search);
  }
  ngOnInit() {
    this.ngZone.run(() => {

      this.loadQueries();
      this.isLoggedIn = this.authService.isLoggedIn();
      if (this.isLoggedIn == true) {
        this.initObjects();
      }
      var d = {
        label: '',
        soql: '',
        object: '',
        fields: [],
        customurl: 'https://login.salesforce.com',
        search: '',
        selectedonly: false
      };
      if (this.queries.length > 0) {
        this.selectQuery(0);
      } else {
        this.queryForm.setValue(d);
      }
    });
  }

  closeSave() {
    this.ngZone.run(() => {
      this.openSave = false;
    });
  }

  openthesave() {
    this.ngZone.run(() => {
      this.openSave = true;
    });
  }

  closeQueries() {
    this.ngZone.run(() => {
      this.openQueries = false;
    });
  }

  openthequeries() {
    this.ngZone.run(() => {
      this.openQueries = true;
    });
  }

  async describeRelationship(i: number) {
    var fields = this.queryForm.get('fields') as FormArray;
    this.onObjectChange(fields.value[i]);
  }

  async onObjectChange(obj?: any) {

    var fields = this.queryForm.get('fields') as FormArray;
    var objname = this.queryForm.value.object;

    if (typeof obj == 'undefined') {
      while (fields.length) {
        fields.removeAt(0);
      }
    } else {
      objname = obj.meta.referenceTo[0];
    }
    this.dataService.describe(objname).then(function (data) {

      this.ngZone.run(() => {
        for (var i = 0; i < data.fields.length; i++) {
          data.fields[i].referenceFrom = obj
          if (typeof obj != 'undefined') {
            data.fields[i].fullLabel = obj.meta.fullLabel + ':' + data.fields[i].label;
            var parent = obj.meta.fullName;
            if (obj.meta.custom == false) {
              if (parent.endsWith('Id')) {
                parent = parent.slice(0, -2);
              }
            } else {
              parent = parent.replace('__c', '__r');
            }
            data.fields[i].fullName = parent + '.' + data.fields[i].name;
          } else {
            data.fields[i].fullLabel = data.fields[i].label;
            data.fields[i].fullName = data.fields[i].name;
          }
          fields.push(this.createField(data.fields[i]));
        }
      })
    }.bind(this));
  }

  createField(field: any, sel?: boolean): FormGroup {
    return this.formBuilder.group({
      selected: [sel || false],
      meta: [field]
    });
  }

  saveQuery() {
    this.queries.push(this.queryForm.value);
    this.officeService.saveToPropertyBag('queries', JSON.stringify(this.queries));
    this.closeSave();
  }

  newQuery() {
    this.queryForm.reset();
  }

  loadQueries() {

    var str = this.officeService.getFromPropertyBag('queries');
    if (str != null) {
      this.queries = JSON.parse(str);
    }
  }

  async updateFieldlist(data: any) {

    var fields = data.qf.fields;
    var q = data.q.toLowerCase();
    data.fieldlist = [];
    var a = q.trim().search(/select /);
    var b = q.search(/ from /);
    var arr = q.trim().substring(a + 7, b).replace(/\s/g, "").split(',');

    for (var i = 0; i < arr.length; i++) {
      if (fields.filter(function (val) { return val.meta.fullName.toLowerCase() == arr[i] }).length == 1) {
        data.fieldlist.push(fields.filter(function (val) { return val.meta.fullName.toLowerCase() == arr[i] })[0]);
      }
    }

  }

  async updateSOQL() {
    var fields = this.queryForm.get('fields') as FormArray;
    var q = 'SELECT ';
    var f = [];
    for (var i = 0; i < fields.value.length; i++) {
      if (fields.value[i].selected == true) {
        f.push(fields.value[i].meta.fullName);
      }
    }
    if (f.length == 0) {
      q = '';
    } else {
      q += f.join(',') + ' FROM ' + this.queryForm.value.object
    }

    this.ngZone.run(() => {
      var value = this.queryForm.value;
      value.soql = q;
      this.queryForm.setValue(value);
    });


  }
  get filteredResults() {
    var fields = this.queryForm.get('fields') as FormArray;
    return fields.controls
      .sort(function (a, b) {
        if (a.value.meta.fullLabel > b.value.meta.fullLabel)
          return 1;
        if (a.value.meta.fullLabel < b.value.meta.fullLabel)
          return -1;
        return 0;
      })
      .filter(function (field) {
        var search = this.queryForm.value.search;
        var selectedonly = this.queryForm.value.selectedonly;

        var matchName = true;
        var matchLabel = true;
        if (search != null) {
          matchName = (field.value.meta.fullName.toUpperCase().indexOf(search.toUpperCase()) > -1);
          matchLabel = (field.value.meta.fullLabel.toUpperCase().indexOf(search.toUpperCase()) > -1);
        }
        var doFilter = (search != '' && search != null);

        return (doFilter == false || (matchName || matchLabel)) && (selectedonly == false || selectedonly == null || field.value.selected);
      }.bind(this));
  }

  initObjects() {
    this.dataService.globalDescribe().then(function (data) {
      this.objects = data.sobjects.filter(function (sobj) {
        return sobj.queryable = true && sobj.searchable == true;
      });
    }.bind(this));
  }

  get f() { return this.queryForm.controls; }

  deleteQuery(i: any) {
    this.queries.splice(i, 1);
    this.officeService.saveToPropertyBag('queries', JSON.stringify(this.queries));
  }

  selectAndRunQuery(i: any) {
    this.selectQuery(i);
    this.runQuery();
  }
  selectQuery(i: any) {

    this.ngZone.run(() => {
      this.queryForm.reset();
      var data = this.queries[i];
      this.queryForm.patchValue({
        label: data.label,
        soql: data.soql,
        object: data.object,
        customurl: data.customurl
      })

      var fields = this.queryForm.get('fields') as FormArray;
      while (fields.length) {
        fields.removeAt(0);
      }

      for (var j = 0; j < data.fields.length; j++) {
        fields.push(this.createField(data.fields[j].meta, data.fields[j].selected));
      }
    })
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.queries, event.previousIndex, event.currentIndex);
    this.officeService.saveToPropertyBag('queries', JSON.stringify(this.queries));
  }

  async runQuery() {
    this.run(this.queryForm.value.soql);
  }

  async runAll() {
    for (var i = 0; i < this.queries.length; i++) {
      this.selectQuery(i);
      this.run(this.queries[i].soql);
    }
  }

  async run(soql: string) {
    this.excelService.fixQuery(soql).then(function (data) {
      this.dataService.query(data).then(function (data) {
        this.updateFieldlist(data);
        this.excelService.createTable(data);
      }.bind(this));
    }.bind(this));
  }

  login() {
    var loginurl = this.queryForm.value.customurl;
    this.authService.login(loginurl).then(function () {
      this.ngZone.run(() => {
        this.isLoggedIn = this.authService.isLoggedIn();
        this.initObjects();
      });
    }.bind(this));
  }

  logout() {
    var baseHref = (this.queryForm.value.customurl);
    this.authService.logout(baseHref).then(function () {
      this.ngZone.run(() => {
        this.isLoggedIn = this.authService.isLoggedIn();
      });
    }.bind(this));
  }
}