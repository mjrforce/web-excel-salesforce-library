import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OfficeDataService } from './office-data-service';
import { OAuthService } from './salesforce-oauth-service'
import { Result } from '../classes/oauth/result';
import { APP_BASE_HREF } from '@angular/common';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
let jsforce = require('jsforce');



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

  ;

  getconfig(): any {

    return this.oauthService.getconfig();
  }
  subscribe(event: String, callback: Function) {
    var conn = new jsforce.Connection(this.getconfig());
    conn.streaming.topic('/event/' + event).subscribe(callback);
  }

  unsubscribe(event: String, callback: Function) {
    var conn = new jsforce.Connection(this.getconfig());
    conn.streaming.topic('/event/' + event).unsubscribe(callback);
  }

  publish(event: string, data: any, callback: Function) {
    var conn = new jsforce.Connection(this.getconfig());
    conn.sobject('/event/' + event).create(data, callback);
  }

  query(q: string, callback: Function) {
    var conn = new jsforce.Connection(this.getconfig());
    conn.query(q, callback);
  }

  globalDescribe(callback: Function) {
    var conn = new jsforce.Connection(this.getconfig());
    conn.describeGlobal(callback);
  }

  start(template: string, callback: Function) {
    var conn = new jsforce.Connection(this.getconfig());
    conn.query("SELECT Id, Name from Excel_Template__c WHERE Name = '" + template + "'", function (err, result) {
      if (err) {
        console.error(err);
      } else {
        var records = [];
        for (var i = 0; i < result.records.length; i++) {
          records.push({ Template_Name__c: result.records[i].Id });
        }
        conn.sobject("Excel_Template_Event__e").create(records, callback);
      }
    });
  }
}
