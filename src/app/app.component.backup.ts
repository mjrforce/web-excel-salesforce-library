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
import { Query } from './classes/Query';
import { qform } from './classes/qform';


declare const Excel: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent {
  isLoggedIn = false;
  queryForm: FormGroup;
  queries: FormArray;
  submitted = false;
  object = "";
  model = new qform();

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
        queries: this.formBuilder.array([this.createQuery()]),
        currentlocation: [true],
        usecustomloginurl: [false],
        customurl: ['https://login.salesforce.com']
      });
    });


  }

  logvalue() {
    console.log('Object: ' + this.object);
  }

  createQuery(): FormGroup {
    return this.formBuilder.group({
      soql: '',
      location: '',
      datamap: this.formBuilder.array([this.createDataMap()]),
      wheremap: this.formBuilder.array([this.createWhereMap()])
    });
  }

  createDataMap(): FormGroup {
    return this.formBuilder.group({
      colname: '',
      fieldname: ''
    });
  }

  createWhereMap(): FormGroup {
    return this.formBuilder.group({
      location: '',
      fieldname: ''
    });
  }

  addQuery(): void {
    this.queries = this.queryForm.get('queries') as FormArray;
    this.queries.push(this.createQuery());
  }

  removeQuery(index: number) {
    this.queries = this.queryForm.get('queries') as FormArray;
    this.queries.removeAt(index);
  }

  addDataMap(i: number): void {
    this.queries = this.queryForm.get('queries') as FormArray;
    var datamap = this.queries.controls[i].get('datamap') as FormArray;
    datamap.push(this.createDataMap());
  }

  addWhereMap(i: number): void {
    console.log(i);
    this.queries = this.queryForm.get('queries') as FormArray;
    var wheremap = this.queries.controls[i].get('wheremap') as FormArray;
    wheremap.push(this.createWhereMap());
  }

  removeWhere(i: number, j: number) {
    this.queries = this.queryForm.get('queries') as FormArray;
    var wheremap = this.queries.controls[i].get('wheremap') as FormArray;
    wheremap.removeAt(j);
  }

  initObjects() {
    this.dataService.globalDescribe().then(function (data) {
      this.model.objects = data.sobjects;
    }.bind(this));
  }

  get usecustomloginurl() {
    return this.queryForm.value.usecustomloginurl;
  }

  get f() { return this.queryForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.queryForm.invalid) {
      return;
    }

    console.log(this.queryForm.value);

    if (false) {
      console.log(JSON.stringify(this.queryForm.value));
      this.dataService.query(this.queryForm.value.soql).then(function (data) {
        data.queryForm = this.queryForm.value;
        this.excelService.createTable(data);
      }.bind(this));
    }
  }

  runQueries() {
    var data = this.queryForm.value;
    console.log(data);
  }

  login() {
    var loginurl = (this.queryForm.value.usecustomloginurl ? this.queryForm.value.customurl : '');
    console.log('Use this url: ' + loginurl)
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
