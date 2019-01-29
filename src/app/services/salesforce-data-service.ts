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

  subscribe() {
    var config = this.officeService.getFromPropertyBag('oauthresult');
    var configobj = JSON.parse(config);
    this.result.accessToken = configobj.accessToken;
    this.result.instanceUrl = configobj.instanceUrl;
    console.log('config: ' + JSON.stringify(configobj));
    console.log('result: ' + JSON.stringify(this.result));
    ////
    this.http.post<string>(this.baseHref + '/api/data/subscribe', this.result, httpOptions).subscribe(function () { console.log('subscribed'); });//
  }

}

