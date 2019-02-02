import { Component, SystemJsNgModuleLoader } from '@angular/core';
import { Inject } from '@angular/core';
import { OAuthService } from '../../services/salesforce-oauth-service';
import { DataService } from '../../services/salesforce-data-service';
import { ExcelService } from '../../services/excel-services';
import { OfficeDataService } from '../../services/office-data-service'
//import * as io from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { APP_BASE_HREF } from '@angular/common';
import { NgZone } from '@angular/core';
import { SFTable } from '../../classes/Excel/SFTable';

declare const Excel: any;
//
@Component({
  selector: 'app-query',
  templateUrl: './query.component.html'
})

export class QueryComponent {

  constructor(private authService: OAuthService,
    private ngZone: NgZone,
    private dataService: DataService,
    private excelService: ExcelService,
    private officeService: OfficeDataService,
    @Inject(APP_BASE_HREF) private baseHref: string) {

  }


  model: SFTable = new SFTable();
  submitted: boolean = false;
  isLive: boolean = false;
  listofsobjects: [] = [];

  onSubmit() { this.submitted = true; }
  onLiveChange(option: boolean) {
    this.ngZone.run(() => {
      this.isLive = option;
    })
  }
  //

  ngOnInit() {
    this.dataService.globalDescribe(function (err, res) {
      if (err) { return console.error(err); }
      console.log('Num of SObjects : ' + res.sobjects.length);
      this.listofsobjects = res.sobjects;
      console.log(JSON.stringify(this.listofsobjects));
    }.bind(this));

  }







}
