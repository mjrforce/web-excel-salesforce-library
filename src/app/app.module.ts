import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgZone } from '@angular/core';
import { AppComponent } from './modules/app/app.component';
import { DataService } from './services/salesforce-data-service';
import { OfficeDataService } from './services/office-data-service';
import { ExcelService } from './services/excel-services';
import { OAuthService } from './services/salesforce-oauth-service';
import { HttpClientModule } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';
import { Result } from './classes/oauth/result';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { TableBuilderComponent } from './modules/builder/table/builder.table.component';
import { HeaderComponent } from './modules/header/header.component';
import { QueryComponent } from './modules/query/query.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { FormsModule } from '@angular/forms';
//
@NgModule({
  declarations: [
    AppComponent,
    TableBuilderComponent,
    HeaderComponent,
    QueryComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
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
