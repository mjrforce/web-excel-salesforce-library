import { Component, SystemJsNgModuleLoader } from '@angular/core';
import { Inject } from '@angular/core';
import { OAuthService } from './services/salesforce-oauth-service';
import { DataService } from './services/salesforce-data-service';
import { OfficeDataService } from './services/office-data-service';
import { ExcelService } from './services/excel-service';

import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { environment } from '../environments/environment';
import { APP_BASE_HREF } from '@angular/common';
import { NgZone } from '@angular/core';



declare const Excel: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent {
  isLoggedIn = false;
  queryForm: FormGroup;
  submitted = false;
  objects = [];

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
      this.initObjects();
      this.isLoggedIn = this.authService.isLoggedIn();
      this.queryForm = this.formBuilder.group({
        soql: [''],
        object: [''],
        fields: this.formBuilder.array([]),
        usecustomloginurl: [false],
        customurl: ['https://login.salesforce.com']
      });
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

  createField(field: any): FormGroup {
    return this.formBuilder.group({
      selected: [false],
      meta: [field]
    });
  }

  updateSOQL() {
    var fields = this.queryForm.get('fields') as FormArray;
    var q = 'SELECT ';
    var f = [];
    console.log(fields);
    for (var i = 0; i < fields.value.length; i++) {
      if (fields.value[i].selected == true) {
        f.push(fields.value[i].meta.name);
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

    if (false) {
      console.log(JSON.stringify(this.queryForm.value));
      this.dataService.query(this.queryForm.value.soql).then(function (data) {
        data.queryForm = this.queryForm.value;
        this.excelService.createTable(data);
      }.bind(this));
    }
  }

  login() {
    var loginurl = (this.queryForm.value.usecustomloginurl ? this.queryForm.value.customurl : '');
    this.authService.login(loginurl).then(function () {
      this.ngZone.run(() => {
        this.isLoggedIn = this.authService.isLoggedIn();
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
