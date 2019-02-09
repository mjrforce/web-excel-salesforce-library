import { Injectable, Inject } from '@angular/core';
import { OfficeDataService } from './office-data-service';
import { DataService } from './salesforce-data-service';
import { APP_BASE_HREF } from '@angular/common';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
declare const Office: any;
declare const WESLI_OAuth_Service;
@Injectable({ providedIn: 'root' })
export class OAuthService {
  constructor(
    private officeDataService: OfficeDataService,
    private dataService: DataService,
    @Inject(APP_BASE_HREF) private baseHref: string) { }

  dlg: any;

  isLoggedIn() {
    var oauth = this.officeDataService.getFromLocalStorage('oauthresult');
    return oauth != '' && oauth != null;
  }

  login() {
    return new Promise(function (resolve, reject) {

      this.dataService.getOauth2().then(function (oauth2) {

        Office.onReady(function () {
          console.log(oauth2.getAuthorizationUrl({ scope: 'api openid web' }));
          Office.context.ui.displayDialogAsync(oauth2.getAuthorizationUrl({ scope: 'api openid web' }), {
            height: 70,
            width: 40
          },
            function (result) {
              this.dlg = result.value;
              this.dlg.addEventHandler("dialogMessageReceived", function (arg) {
                this.dlg.close();
                var code = arg.message.substring(arg.message.indexOf('code=') + 5);
                this.dataService.getOauth2().then(function (conn) {
                  conn.authorize(code, function (err, userInfo) {
                    this.officeDataService.saveToLocalStorage('oauthresult', JSON.stringify(conn));
                    resolve(conn);
                  }.bind(this));
                }.bind(this));
              }.bind(this));
            }.bind(this));
        }.bind(this));
      }.bind(this));
    }.bind(this));
  }

  logout() {

    return new Promise(function (resolve, reject) {
      var settings = JSON.parse(this.officeDataService.getFromLocalStorage('oauthresult'));
      console.log('Settings: ' + JSON.stringify(settings));
      WESLI_OAuth_Service.getLogout(settings.access_token,
        function (response: any, event: any) {
          if (event.statusCode == '200') {
            this.officeDataService.clearLocalStorage('oauthresult');
            resolve(response);
          }
          else {
            reject();
          }
        }.bind(this));
    }.bind(this));
  }


}
