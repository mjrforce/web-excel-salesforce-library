import { Component, SystemJsNgModuleLoader } from '@angular/core';
import { Inject } from '@angular/core';
import { OAuthService } from './services/salesforce-oauth-service';
import { DataService } from './services/salesforce-data-service';
import { OfficeDataService } from './services/office-data-service';
import { ExcelService } from './services/excel-service';

import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { environment } from '../environments/environment';
import { APP_BASE_HREF } from '@angular/common';
import { NgZone } from '@angular/core';
import { QUERIES } from '@angular/core/src/render3/interfaces/view';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { isForInStatement } from 'typescript';


declare const Excel: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
    isLoggedIn = false;
    constructor(
        private authService: OAuthService,
        private ngZone: NgZone,
        private dataService: DataService,
        private officeService: OfficeDataService,
        private excelService: ExcelService,
        private formBuilder: FormBuilder,
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