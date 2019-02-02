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
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent {

  //socket: SocketIOClient.Socket;//

  constructor(private authService: OAuthService,
    private ngZone: NgZone,
    private dataService: DataService,
    private excelService: ExcelService,
    private officeService: OfficeDataService,
    @Inject(APP_BASE_HREF) private baseHref: string) {
    //this.socket = io(baseHref, {
    //  path: '/io/socket.io'
    //});
  }

  ngOnInit() {
    //this.socket.on('excel-event', this.addEvent);//
  }






}