import { Injectable, Inject } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { OfficeDataService } from './office-data-service';
declare const Office: any;

@Injectable({ providedIn: 'root' })
export class OAuthService {
  constructor(
    @Inject(APP_BASE_HREF) private baseHref: string,
    private officeDataService: OfficeDataService) { }

  ngOnInit() {

  }

  getloginUrl(callback: Function) {

  }

  getLogout(token: string, callback: Function) {

  }

  isLoggedIn() {
    return this.officeDataService.getFromLocalStorage('oauthresult') != null &&
      this.officeDataService.getFromLocalStorage('oauthresult') != ''
  }

  login(callback: Function) {
    Office.onReady(function () {
      this.getloginUrl(function (result: string) {
        var parser = new DOMParser;
        var dom = parser.parseFromString('<!doctype html><body>' + result, 'text/html');
        var decodedString = dom.body.textContent;

        Office.context.ui.displayDialogAsync(decodedString, {
          height: 70,
          width: 40
        },
          function (result) {
            this.dlg = result.value;
            this.dlg.addEventHandler("dialogMessageReceived", function (arg: any) {
              this.dlg.close();

              var conn = {}
              var arr1 = arg.message.substring(1).split('&');
              for (var i = 0; i < arr1.length; i++) {
                var arr2 = arr1[i].split('=');
                conn[arr2[0]] = decodeURIComponent(arr2[1]);
              }
              this.officeDataService.saveToLocalStorage('oauthresult', JSON.stringify(conn));
            }.bind(this));
          }.bind(this));
      }.bind(this))
    });
  }

  logout(callback: Function) {
    var oauth2 = this.officeDataService.getFromLocalStorage('oauthresult');
    this.getLogout(JSON.parse(oauth2).access_token, function () {
      this.officeDataService.clearLocalStorage('oauthresult');
    });
  }
}
