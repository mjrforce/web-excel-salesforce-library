import { Injectable, Inject } from '@angular/core';
import { OfficeDataService } from './office-data-service';
import { DataService } from './salesforce-data-service';
import { APP_BASE_HREF } from '@angular/common';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
declare const Office: any;

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
    this.dataService.getOauth2().then(function (oauth2) {

      Office.onReady(function () {
        Office.context.ui.displayDialogAsync(oauth2.getAuthorizationUrl({ scope: 'api id web' }), {
          height: 70,
          width: 40
        },
          function (result) {
            this.dlg = result.value;
            this.dlg.addEventHandler("dialogMessageReceived", function (arg) {
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
      });

    });
  }

  logout() {
    this.dataService.getConnection().logout(function (err) {
      if (err) { return console.error(err); }
      // now the session has been expired.
      this.officeDataService.clearLocalStorage('oauthresult');
    });
  }


}
