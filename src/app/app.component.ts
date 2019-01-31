import { Component, SystemJsNgModuleLoader } from '@angular/core';
import { Inject } from '@angular/core';
import { OAuthService } from './services/salesforce-oauth-service';
import { DataService } from './services/salesforce-data-service';
import * as io from 'socket.io-client';
import { environment } from '../environments/environment';
import { APP_BASE_HREF } from '@angular/common';
import { NgZone } from '@angular/core';

declare const Excel: any;

//
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
    @Inject(APP_BASE_HREF) private baseHref: string) {
    this.socket = io(baseHref, {
      path: '/io/socket.io'
    });

  }

  events: any[] = [];

  ngOnInit() {
    var component = this;
    this.ngZone.run(() => {
      component.isLoggedIn = component.authService.isLoggedIn();
    });
    //this.socket.on('excel-event', this.addEvent);
    this.socket.on('create-table', this.addTable);

  }

  addEvent = (event: any): void => {
    console.log(event);
    var component = this;
    this.ngZone.run(() => {
      component.events.push(event);
      var messagestr: string;
      messagestr = event['message']['Message__c'];
      var message = JSON.parse(messagestr);
      component.changeColor(message.color);
    });
  }
  //
  login() {
    var component = this;
    component.authService.login(function (message: any) {
      component.ngZone.run(() => {
        component.isLoggedIn = true;
        component.dataService.subscribe(function () {

        });
      });
    });
  }
  addTable = (event: any): void => {
    console.log(event);
    var component = this;
    this.ngZone.run(() => {
      component.events.push(event);
      console.log('event: ' + JSON.stringify(event));
      console.log('message: ' + JSON.stringify(event['message']));
      console.log('data: ' + JSON.stringify(event['message']['data']))
      this.asyncAddTable(JSON.parse(event['message']['data']));



    });//
  }
  async asyncAddTable(data: any) {
    console.log('starting add table');
    try {
      await Excel.run(async context => {
        console.log('inside excel - message');
        console.log(data);

        var sheet = context.workbook.worksheets.getActiveWorksheet();

        var rangeString = "A1:C" + (data.length);
        console.log('Range String: ' + rangeString);

        var range = sheet.getRange(rangeString);

        console.log('arraydata: ' + JSON.stringify(data));
        range.values = data;

        // Create the table over the range
        var table = sheet.tables.add(rangeString, true);
        table.getRange().format.autofitColumns();
        table.getRange().format.autofitRows();
        table.name = "Example";
        console.log('start sync');

        table.getRange().format.autofitColumns();
        table.getRange().format.autofitRows();



        await context.sync();//

      });
    } catch (error) {

    }
  }


  createtable() {
    this.dataService.publish('a1a1U000000hTuQQAU', function () {

    })
  }

  logout() {
    var component = this;
    this.dataService.unsubscribe(function () {
      component.authService.logout(function (result: any) {
        component.ngZone.run(() => {
          if (result.success) {
            component.isLoggedIn = false;
          }
        });

      });
    });

  }

  async changeColor(color: string) {
    try {
      await Excel.run(async context => {
        /**
         * Insert your Excel code here
         */
        const range = context.workbook.getSelectedRange();

        // Read the range address
        range.load('address');

        // Update the fill color
        range.format.fill.color = color;

        await context.sync();
        console.log(`The range address was ${range.address}.`);
      });
    } catch (error) {

    }
  }

  run() {
    this.login();
  }
}
