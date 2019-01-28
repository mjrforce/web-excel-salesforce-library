import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OfficeDataService } from './office-data-service'
import { Result } from '../classes/oauth/result';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class DataService {

  constructor(private http: HttpClient, private officeService: OfficeDataService, private result: Result) { }

  subscribe() {
    var config = this.officeService.getFromPropertyBag('oauthresult');
    var configobj = JSON.parse(config);
    this.result.accessToken = configobj.accessToken;
    this.result.instanceURL = configobj.instanceURL;
    console.log('config: ' + JSON.stringify(configobj));
    console.log('result: ' + JSON.stringify(this.result));
    ////
    this.http.post<string>('api/data/subscribe', this.result, httpOptions).subscribe(function () { console.log('subscribed'); });//
  }

}
