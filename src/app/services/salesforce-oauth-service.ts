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
      Office.context.ui.displayDialogAsync(service.baseHref + '/api/oauth/auth', {
        height: 70,
        width: 40
      },
        function (result: any) {
          service.dlg = result.value;
          service.dlg.addEventHandler("dialogMessageReceived", function (arg: any) {
            service.dlg.close();
            service.officeService.saveToLocalStorage('oauthresult', arg.message);
            callback(arg.message as any);
          });
        });
    });
  }

  getconfig(): any {
    var config = JSON.parse(this.officeService.getFromLocalStorage('oauthresult'));
    return config.connection;
  }


  logout(callback: Function) {

    this.http.post<string>(this.baseHref + '/api/oauth/logout', this.getconfig(), httpOptions).subscribe(function (data) {
      this.officeService.clearLocalStorage('oauthresult');
      callback(data as any);
    }.bind(this));
  }

  isLoggedIn() {
    var settings = this.getconfig();
    return settings != null;//
  }
}
