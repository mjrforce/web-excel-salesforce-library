import { Injectable, Inject } from '@angular/core';
import { OfficeDataService } from './office-data-service';
import { APP_BASE_HREF } from '@angular/common';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

declare const jsforce: any;
declare const WesliOauth: any;

@Injectable({ providedIn: 'root' })
export class DataService {

  constructor(@Inject(APP_BASE_HREF) private baseHref: string,
    private officeService: OfficeDataService) { }

  OauthPromise = new Promise(function (resolve, reject) {
    WesliOauth.getOauthSettings(function (response: any, event: any) {
      if (event.statusCode == '200') {
        resolve(response);
      }
      else {
        reject();
      }
    });
  });

  getOauth2() {
    return WesliOauth.then(function (response) {
      console.log('Custom Settings: ' + JSON.stringify(response));
      return new jsforce.OAuth2(response);
    });
  }
}
