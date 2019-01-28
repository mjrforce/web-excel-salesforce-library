import { Component } from '@angular/core';
import { Inject } from '@angular/core';
import { OAuthService } from './services/salesforce-oauth-service';
import { DataService } from './services/salesforce-data-service';
import * as io from 'socket.io-client';
import { Event } from './classes/event';
import { environment } from '../environments/environment';
import { APP_BASE_HREF } from '@angular/common';

import { NgZone } from '@angular/core';
declare const Excel: any;
//
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  welcomeMessage = 'Welcome';
  socket: SocketIOClient.Socket;

  constructor(private authService: OAuthService,
    private ngZone: NgZone,
    private dataService: DataService,
    @Inject(APP_BASE_HREF) private baseHref: string) {
    this.socket = io(baseHref, {
      path: '/io/socket.io'
    });
    //
  }

  events: Event[] = [];

  addEvent = (event: Event): void => {
    console.log(event);
    var component = this;
    this.ngZone.run(() => {
      component.events.push(event);
    });
  }

  ngOnInit() {
    var component = this;
    this.ngZone.run(() => {
      component.welcomeMessage = 'Please Log In';
    });
    this.socket.on('excel-event', this.addEvent);
  }



  login() {
    var component = this;
    component.authService.login(function (message: any) {
      console.log('From Component: ' + message);
      component.ngZone.run(() => {
        component.welcomeMessage = 'Logged In';
        component.dataService.subscribe();
      });
    });
    //
  }
  async run() {
    this.login();
    try {
      await Excel.run(async context => {
        /**
         * Insert your Excel code here
         */
        const range = context.workbook.getSelectedRange();

        // Read the range address
        range.load('address');

        // Update the fill color
        range.format.fill.color = 'yellow';

        await context.sync();
        console.log(`The range address was ${range.address}.`);
      });
    } catch (error) {

    }
  }
}
