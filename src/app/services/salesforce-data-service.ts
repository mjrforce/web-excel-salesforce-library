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


  getOauth2() {
    return this.OauthPromise.then(function (response) {
      return new jsforce.OAuth2(response);
    });
  }

  getConnection() {
    var token = JSON.parse(this.officeService.getFromLocalStorage('oauthresult'));
    console.log(token);
    var conn = new jsforce.Connection();
    return conn;
  }
}
