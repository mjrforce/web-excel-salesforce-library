import { Component, SystemJsNgModuleLoader } from '@angular/core';
import { Inject } from '@angular/core';
import { OAuthService } from '../../services/salesforce-oauth-service';
import { DataService } from '../../services/salesforce-data-service';
import { ExcelService } from '../../services/excel-services';
import { OfficeDataService } from '../../services/office-data-service'
import { environment } from '../../../environments/environment';
import { APP_BASE_HREF } from '@angular/common';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})

export class HeaderComponent {

  isLoggedIn = false;
  constructor(private authService: OAuthService, private ngZone: NgZone) { }
  ngOnInit() {
    this.ngZone.run(() => {
      this.isLoggedIn = this.authService.isLoggedIn();
    });
  }

  login() {
    this.authService.login(function (success: Boolean) {
      this.ngZone.run(() => {
        this.isLoggedIn = success;
      })
    }.bind(this));
  }

  unsubscribeall() {

  }

  logout() {
    this.authService.logout(function (data: any) {
      this.unsubscribeall();
      this.ngZone.run(() => {
        this.isLoggedIn = false;
      }).bind(this);
    }.bind(this));
  }

}
