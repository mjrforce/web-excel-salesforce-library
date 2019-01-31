import { Component, SystemJsNgModuleLoader } from '@angular/core';
import { Inject } from '@angular/core';
import { OAuthService } from './services/salesforce-oauth-service';
import { DataService } from './services/salesforce-data-service';
import { ExcelService } from './services/excel-services';
import { OfficeDataService } from './services/office-data-service'
import * as io from 'socket.io-client';
import { environment } from '../environments/environment';
import { APP_BASE_HREF } from '@angular/common';
import { NgZone } from '@angular/core';

declare const Excel: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent {
  isLoggedIn = false;
  socket: SocketIOClient.Socket;

  constructor(private authService: OAuthService,
    private ngZone: NgZone,
    private dataService: DataService,
    private excelService: ExcelService,
    private officeService: OfficeDataService,
    @Inject(APP_BASE_HREF) private baseHref: string) {
    this.socket = io(baseHref, {
      path: '/io/socket.io'
    });
    //
  }

  events: any[] = this.excelService.getEvents();

  ngOnInit() {
    this.ngZone.run(() => {
      this.isLoggedIn = this.authService.isLoggedIn();
    });
    //this.socket.on('excel-event', this.addEvent);//
    this.socket.on('create-table', this.excelService.createTable);
  }

  checklogin() {
    console.log(this.authService.isLoggedIn());
  }

  createtable() {
    console.log(this.officeService.getFromLocalStorage('authresult'));
    this.excelService.start('query accounts');
  }

  login() {

    this.authService.login(function (message: any) {

      this.ngZone.run(() => {
        this.isLoggedIn = true;
        this.dataService.subscribe(function () {
        });
      })
    }.bind(this));
  }

  logout() {

    var service = this;
    this.dataService.unsubscribe(function () {
      this.authService.logout(function (result: any) {
        this.ngZone.run(() => {
          if (result.success) {
            this.isLoggedIn = false;
          }
        });
      }.bind(this));
    }.bind(this));
  }
}
