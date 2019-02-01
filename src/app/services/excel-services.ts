import { Component, SystemJsNgModuleLoader } from '@angular/core';
import { Inject } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { DataService } from '../services/salesforce-data-service';
import { NgZone } from '@angular/core';

declare const Excel: any;

export class ExcelService {

  events: any[] = [];

  constructor(
    @Inject(APP_BASE_HREF) private baseHref: string,
    private dataService: DataService,
    private ngZone: NgZone, ) {
  }

  ngOnInit() {
  }

  getEvents(): any[] {
    return this.events;
  }

  addEvent(event: any) {
    var service = this;
    this.ngZone.run(() => {
      service.events.push(event);
    });
  }

  socketEventHandler = (event: any): void => {
    console.log('socket event: ' + JSON.stringify(event));

    if (event['message'].name == 'create-table')
      this.asynccreateTable(event['message']);

  }

  /**
 * Init Process by name
 */

  start(process: string) {
    this.dataService.start(process, function () {
    })
  }

  /**
   * Get Data from Excel_Event__e
   */



  async asynccreateTable(data: any) {
    console.log('create-table');
    try {
      await Excel.run(async context => {


        var sheet = context.workbook.worksheets.getActiveWorksheet();
        var sheetdata = JSON.parse(data.data);
        console.log(sheetdata.length);
        var rangeString = "A1:C" + (sheetdata.length);
        console.log(rangeString);
        var range = sheet.getRange(rangeString);
        console.log(sheetdata);
        range.values = sheetdata;
        console.log(range.values);


        var table = sheet.tables.add(rangeString, true);
        table.getRange().format.autofitColumns();
        table.getRange().format.autofitRows();
        table.name = 'Example';

        table.getRange().format.autofitColumns();
        table.getRange().format.autofitRows();

        await context.sync();

      });
    } catch (error) {
      console.log(error);
    }
  }

  async changeColor(event: any) {
    try {
      await Excel.run(async context => {

        const range = context.workbook.getSelectedRange();
        range.load('address');
        // range.format.fill.color = data.color;
        await context.sync();;
      });
    } catch (error) {

    }
  }


}
