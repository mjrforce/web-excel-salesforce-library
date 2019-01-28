import { Component } from '@angular/core';
import { OAuthService } from './services/salesforce-oauth-service';
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

  constructor(private authService: OAuthService, private ngZone: NgZone) {
    var component = this;
    this.ngZone.run(() => {
      component.welcomeMessage = 'Please Log In';
    });
  }

  login() {
    var component = this;
    component.authService.login(function (message: any) {
      console.log('From Component: ' + message);
      component.ngZone.run(() => {
        component.welcomeMessage = 'Logged In';
      });
    });

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
