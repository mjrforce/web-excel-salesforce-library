import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OfficeDataService } from './office-data-service';
import { OAuthService } from './salesforce-oauth-service'
import { Result } from '../classes/oauth/result';
import { APP_BASE_HREF } from '@angular/common';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
//////
const httpOptions = {
  headers: new HttpHeaders({ 'Content-type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class DataService {

  constructor(@Inject(APP_BASE_HREF) private baseHref: string,
    private http: HttpClient,
    private officeService: OfficeDataService,
    private oauthService: OAuthService,
    private result: Result) { }

  getconfig(): any {
    console.log('from oauth service: ' + JSON.stringify(this.oauthService.getconfig()));
    console.log(this.oauthService.getconfig());
    return this.oauthService.getconfig();
  }
  subscribe(callback: Function) {

    this.http.post<string>(this.baseHref + '/api/data/subscribe', this.getconfig(), httpOptions).subscribe(function () {
      console.log('subscribed');
      callback();
    });
  }

  unsubscribe(callback: Function) {
    console.log(this.getconfig());
    console.log(this.baseHref);
    this.http.post<string>(this.baseHref + '/api/data/unsubscribe', this.getconfig(), httpOptions).subscribe(function () {
      console.log('unsubscribed');
      callback();
    });
  }

  publish(template: string, callback: Function) {

    console.log({ connection: JSON.parse(this.officeService.getFromPropertyBag('oauthresult')), template: template });
    this.http.post<string>(
      this.baseHref + '/api/data/publish',
      {
        connection: JSON.parse(this.officeService.getFromPropertyBag('oauthresult')),
        template: template
      },
      httpOptions).subscribe(function (res: any) {
        console.log(res);
        callback();
      });
  }

  start(template: string, callback: Function) {

    this.http.post<string>(
      this.baseHref + '/api/data/start',
      {
        connection: this.getconfig(),
        q: template
      },
      httpOptions).subscribe(function (res: any) {
        callback();
      });
  }
}
