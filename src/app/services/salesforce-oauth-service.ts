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
  constructor(private http: HttpClient, private officeService: OfficeDataService, @Inject(APP_BASE_HREF) private baseHref: string) { }
  dlg = null;
  connection = null;


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
            service.officeService.saveToPropertyBag('oauthresult', arg.message)
            callback(arg.message as any);
          });
        });
    });
  }

}
