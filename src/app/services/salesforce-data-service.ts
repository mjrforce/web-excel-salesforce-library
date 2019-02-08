import { Injectable, Inject } from '@angular/core';
import { OfficeDataService } from './office-data-service';
import { OAuthService } from './salesforce-oauth-service'
import { APP_BASE_HREF } from '@angular/common';

declare const jsforce: any;

@Injectable({ providedIn: 'root' })
export class DataService {

  constructor(@Inject(APP_BASE_HREF) private baseHref: string,
    private officeService: OfficeDataService,
    private oauthService: OAuthService) { }


  subscribe(callback: Function) {

  }

  unsubscribe(callback: Function) {

  }

  publish(template: string, callback: Function) {

  }

}
