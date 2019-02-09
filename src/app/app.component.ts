import { Component, SystemJsNgModuleLoader } from '@angular/core';
import { Inject } from '@angular/core';
import { OAuthService } from './services/salesforce-oauth-service';
import { DataService } from './services/salesforce-data-service';
import { ExcelService } from './services/excel-services';
import { OfficeDataService } from './services/office-data-service'
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

  constructor(
    private authService: OAuthService,
    private ngZone: NgZone,
    private dataService: DataService,
    private excelService: ExcelService,
    private officeService: OfficeDataService,
    @Inject(APP_BASE_HREF) private baseHref: string) {

  }

  ngOnInit() {
    this.ngZone.run(() => {
      this.isLoggedIn = this.authService.isLoggedIn();
    });

  }

  login() {
    this.authService.login().then(function () {
      this.ngZone.run(() => {
        this.isLoggedIn = this.authService.isLoggedIn();
      }).bind(this);
    });
  }

  logout() {
    this.authService.logout().then(function () {
      this.ngZone.run(() => {
        this.isLoggedIn = this.authService.isLoggedIn();
      }).bind(this);
    });
  }

  runQuery() {

  }
}
