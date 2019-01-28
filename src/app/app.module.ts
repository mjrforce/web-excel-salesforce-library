import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgZone } from '@angular/core';
import { AppComponent } from './app.component';
import { DataService } from './services/salesforce-data-service';
import { OfficeDataService } from './services/office-data-service';
import { OAuthService } from './services/salesforce-oauth-service';
import { HttpClientModule } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';
//

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    DataService,
    OfficeDataService,
    OAuthService,
    [{ provide: APP_BASE_HREF, useValue: '/dist' }]
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
