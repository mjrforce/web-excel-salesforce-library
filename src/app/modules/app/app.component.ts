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

declare const Excel: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent {
  isLoggedIn = false;
  //socket: SocketIOClient.Socket;

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

  events: any[] = this.excelService.getEvents();

  ngOnInit() {
    this.ngZone.run(() => {
      this.isLoggedIn = this.authService.isLoggedIn();
    });
    //this.socket.on('excel-event', this.addEvent);//
  }

  start() {
    this.dataService.start('query accounts', function () {
      console.log('starting query accounts');
    });
  }

  login() {
    this.authService.login(function (success: Boolean) {
      this.ngZone.run(() => {
        this.isLoggedIn = success;
      })
    }.bind(this));
  }

  unsubscribeall() {

  }

  logout() {
    this.authService.logout(function (data: any) {
      this.unsubscribeall();
      this.ngZone.run(() => {
        this.isLoggedIn = false;
      }).bind(this);
    }.bind(this));
  }

}
