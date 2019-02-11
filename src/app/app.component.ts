import { Component, SystemJsNgModuleLoader } from '@angular/core';
import { Inject } from '@angular/core';
import { OAuthService } from './services/salesforce-oauth-service';
import { DataService } from './services/salesforce-data-service';
import { OfficeDataService } from './services/office-data-service';
import { ExcelService } from './services/excel-service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
      this.isLoggedIn = this.authService.isLoggedIn();
      this.queryForm = this.formBuilder.group({
        soql: ['', Validators.required],
        currentlocation: [true],
        usecustomloginurl: [false],
        customurl: ['https://login.salesforce.com']
      });
    });


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

    console.log(JSON.stringify(this.queryForm.value));
    this.dataService.query(this.queryForm.value.soql).then(function (data) {
      data.queryForm = this.queryForm.value;
      this.excelService.createTable(data);
    }.bind(this));
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
    this.authService.logout().then(function () {
      this.ngZone.run(() => {
        this.isLoggedIn = this.authService.isLoggedIn();
      });
    }.bind(this));
  }
}
