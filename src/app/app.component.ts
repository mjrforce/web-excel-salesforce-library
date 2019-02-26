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


declare const Excel: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent {
  isLoggedIn = false;
  submitted = false;
  objects = [];
  queries = [];
  openSave = false;
  openQueries = false;
  fieldarray = [];
  queryForm = new FormGroup({
    label: new FormControl(''),
    soql: new FormControl(''),
    object: new FormControl(''),
    fields: new FormArray([]),
    usecustomloginurl: new FormControl(''),
    customurl: new FormControl('')
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

  ngOnInit() {
    this.ngZone.run(() => {

      this.loadQueries();
      console.log('queries: ');
      console.log(this.queries);

      this.isLoggedIn = this.authService.isLoggedIn();
      if (this.isLoggedIn == true) {
        this.initObjects();
      }
      var d = {
        label: '',
        soql: '',
        object: '',
        fields: [],
        usecustomloginurl: false,
        customurl: 'https://login.salesforce.com'
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

  onObjectChange() {
    console.log(this.queryForm.value.object)
    this.dataService.describe(this.queryForm.value.object).then(function (data) {
      this.ngZone.run(() => {

        var fields = this.queryForm.get('fields') as FormArray;
        while (fields.length) {
          fields.removeAt(0);
        }

        console.log(data.fields);
        for (var i = 0; i < data.fields.length; i++) {
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
    console.log(this.queries);
    this.officeService.saveToPropertyBag('queries', JSON.stringify(this.queries));
    console.log(this.officeService.getFromPropertyBag('queries'));
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

  updateFieldlist() {
    var fields = this.queryForm.get('fields') as FormArray;
    this.fieldarray = [];
    for (var i = 0; i < fields.value.length; i++) {
      if (fields.value[i].selected == true) {
        this.fieldarray.push(fields.value[i]);
      }
    }
  }

  updateSOQL() {
    var fields = this.queryForm.get('fields') as FormArray;
    var q = 'SELECT ';
    var f = [];
    this.fieldarray = [];
    console.log(fields);
    for (var i = 0; i < fields.value.length; i++) {
      if (fields.value[i].selected == true) {
        f.push(fields.value[i].meta.name);
        this.fieldarray.push(fields.value[i]);
      }
    }
    if (f.length == 0) {
      q = '';
    } else {
      console.log(this.queryForm.value.object)
      q += f.join(',') + ' FROM ' + this.queryForm.value.object
    }

    this.ngZone.run(() => {
      var value = this.queryForm.value;
      console.log(value);
      value.soql = q;
      console.log(value);
      this.queryForm.setValue(value);
    });


  }

  initObjects() {
    this.dataService.globalDescribe().then(function (data) {
      this.objects = data.sobjects;
    }.bind(this));
  }

  get f() { return this.queryForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.queryForm.invalid) {
      return;
    }
  }

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
        usecustomloginurl: data.usecustomloginurl,
        customurl: data.customurl
      })

      var fields = this.queryForm.get('fields') as FormArray;
      while (fields.length) {
        fields.removeAt(0);
      }

      console.log(data.fields);
      for (var j = 0; j < data.fields.length; j++) {
        fields.push(this.createField(data.fields[j].meta, data.fields[j].selected));
      }
    })
  }

  async runQuery() {
    this.run(this.queryForm.value.soql, this.queryForm.value);
  }

  async runAll() {
    for (var i = 0; i < this.queries.length; i++) {
      this.run(this.queries[i].soql, this.queries[i]);
    }
  }

  async run(soql: string, queryForm: any) {

    this.dataService.query(soql, queryForm).then(function (data) {
      data.queryForm = this.queryForm.value;
      this.updateFieldlist();
      data.fieldlist = this.fieldarray;
      this.excelService.createTable(data);
    }.bind(this));
  }

  login() {
    var loginurl = (this.queryForm.value.usecustomloginurl ? this.queryForm.value.customurl : '');
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
