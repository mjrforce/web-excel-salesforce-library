import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OfficeDataService } from './office-data-service'
import { APP_BASE_HREF } from '@angular/common';
import { Result } from '../classes/oauth/result';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
declare const Office: any;


const httpOptions = {
  headers: new HttpHeaders({ 'Content-type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class OAuthService {
  constructor(private http: HttpClient,
    private officeService: OfficeDataService,
    @Inject(APP_BASE_HREF) private baseHref: string,
    private result: Result) { }
  dlg = null;
  connection = null;

  ngOnInit() {
    this.result = new Result();
  }


  login(callback: Function) {
    var service = this;
    Office.onReady(function () {
      console.log('Base: ' + service.baseHref);
      Office.context.ui.displayDialogAsync(service.baseHref + '/api/oauth/auth', {
        height: 70,
        width: 40
      },
        function (result: any) {
          console.log('result: ' + JSON.stringify(result));
          service.dlg = result.value;
          service.dlg.addEventHandler("dialogMessageReceived", function (arg: any) {
            console.log(arg);
            service.dlg.close();
            service.officeService.saveToPropertyBag('oauthresult', arg.message);
            callback(arg.message as any);
          });
        });
    });
  }

  getconfig() {
    var config = this.officeService.getFromPropertyBag('oauthresult');
    var configobj = JSON.parse(config);
    this.result.accessToken = configobj.accessToken;
    this.result.instanceUrl = configobj.instanceUrl;
    return this.result;
  }

  logout(callback: Function) {
    var service = this;
    this.http.post<string>(this.baseHref + '/api/oauth/logout', this.getconfig(), httpOptions).subscribe(function (data) {
      console.log(data);
      service.officeService.saveToPropertyBag('oauthresult', null);
      callback(data as any);
    });
  }

  isLoggedIn() {
    var settings = this.officeService.getFromPropertyBag('oauthresult');
    return settings != null;
  }
}
