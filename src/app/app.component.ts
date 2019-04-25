import { Component, SystemJsNgModuleLoader } from '@angular/core';
import { Inject } from '@angular/core';
import { OAuthService } from './services/salesforce-oauth-service';
import { APP_BASE_HREF } from '@angular/common';
import { NgZone } from '@angular/core';

declare const Excel: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
    isLoggedIn = false;
    constructor(
        private ngZone: NgZone,
        private authService: OAuthService,
        @Inject(APP_BASE_HREF) private baseHref: string) {
    
      }
    
    prod(){
        this.login("https://login.salesforce.com/");
    }
    
    sand(){
         this.login("https://test.salesforce.com/");
    }

    login(loginUrl: string) {

        this.authService.login(loginUrl).then(function () {
          this.ngZone.run(() => {
            this.isLoggedIn = this.authService.isLoggedIn();
            
          });
        }.bind(this));
      }

}