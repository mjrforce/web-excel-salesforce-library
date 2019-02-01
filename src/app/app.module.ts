import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgZone } from '@angular/core';
import { AppComponent } from './app.component';
import { DataService } from './services/salesforce-data-service';
import { OfficeDataService } from './services/office-data-service';
import { ExcelService } from './services/excel-services';
import { OAuthService } from './services/salesforce-oauth-service';
import { HttpClientModule } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';
import { Result } from './classes/oauth/result';
import { environment } from '../environments/environment';


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
    ExcelService,
    Result,
    [{ provide: APP_BASE_HREF, useValue: environment.baseURL }]
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
