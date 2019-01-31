import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OfficeDataService } from './office-data-service'
import { Result } from '../classes/oauth/result';
import { APP_BASE_HREF } from '@angular/common';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
//
const httpOptions = {
  headers: new HttpHeaders({ 'Content-type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class DataService {

  constructor(@Inject(APP_BASE_HREF) private baseHref: string,
    private http: HttpClient,
    private officeService: OfficeDataService,
    private result: Result) { }

  getconfig() {
    var config = this.officeService.getFromPropertyBag('oauthresult');
    var configobj = JSON.parse(config);
    this.result.accessToken = configobj.accessToken;
    this.result.instanceUrl = configobj.instanceUrl;
    return this.result;
  }
  subscribe(callback: Function) {
    this.http.post<string>(this.baseHref + '/api/data/subscribe', this.getconfig(), httpOptions).subscribe(function () {
      console.log('subscribed');
      callback();
    });
  }

  unsubscribe(callback: Function) {
    this.http.post<string>(this.baseHref + '/api/data/unsubscribe', this.getconfig(), httpOptions).subscribe(function () {
      console.log('unsubscribed');
      callback();
    });
  }

  publish(template: string, callback: Function) {

    console.log({ connection: JSON.parse(this.officeService.getFromPropertyBag('oauthresult')), template: template });
    this.http.post<string>(
      this.baseHref + '/api/data/publish',
      { connection: JSON.parse(this.officeService.getFromPropertyBag('oauthresult')), template: template },
      httpOptions).subscribe(function (res: any) {
        console.log(res);
        callback();
      });
  }
}
