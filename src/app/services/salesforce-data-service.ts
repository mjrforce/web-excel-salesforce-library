import { Injectable, Inject } from '@angular/core';
import { OfficeDataService } from './office-data-service';
import { APP_BASE_HREF } from '@angular/common';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

declare const jsforce: any;
declare const WESLI_OAuth_Service: any;

@Injectable({ providedIn: 'root' })
export class DataService {

  constructor(@Inject(APP_BASE_HREF) private baseHref: string,
    private officeService: OfficeDataService) { }

  OauthPromise = new Promise(function (resolve, reject) {
    console.log('starting javascript remoting');
    WESLI_OAuth_Service.getSettings(function (response: any, event: any) {
      if (event.statusCode == '200') {
        console.log(response);
        resolve(response);
      }
      else {
        reject();
      }
    });
  });



  getLoginUrl() {
    return new Promise(function (resolve, reject) {

      WESLI_OAuth_Service.getloginUrl(function (response: any, event: any) {
        if (event.statusCode == '200') {
          resolve(response);
        }
        else {
          reject();
        }
      });
    });
  }


  getOauth2() {
    return this.OauthPromise.then(function (response) {
      return new jsforce.OAuth2(response);
    });
  }

  getConnection() {
    return this.getOauth2().then(function (oauth2) {
      var conn = new jsforce.Connection({ oauth2: oauth2 });
      return conn;
    });
  }
}
