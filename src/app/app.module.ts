import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgZone } from '@angular/core';
import { AppComponent } from './app.component';
import { DataService } from './services/salesforce-data-service';
import { OfficeDataService } from './services/office-data-service';
import { OAuthService } from './services/salesforce-oauth-service';
import { HttpClientModule } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';
import { environment } from '../environments/environment';
import { ReactiveFormsModule } from '@angular/forms';
import { ExcelService } from './services/excel-service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Query } from './classes/Query';
import { FilterPipe } from './pipes/filter-pipe';

@NgModule({
  declarations: [
    AppComponent,
    FilterPipe

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    DragDropModule,
    BrowserAnimationsModule
  ],
  providers: [
    DataService,
    OfficeDataService,
    OAuthService,
    ExcelService,
    Query,

    [{ provide: APP_BASE_HREF, useValue: environment.baseURL }]
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
