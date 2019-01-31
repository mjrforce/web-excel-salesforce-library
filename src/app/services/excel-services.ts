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

  getData = (event: any): any => {
    var datastr: string;
    datastr = event['message']['data'];
    var data = JSON.parse(datastr);
    return data;
  }

  async createTable(event: any) {
    console.log(event);
    try {
      await Excel.run(async context => {

        var data = this.getData(event);
        var sheet = context.workbook.worksheets.getActiveWorksheet();
        var rangeString = "A1:C" + (data.length);
        var range = sheet.getRange(rangeString);
        range.values = data;

        var table = sheet.tables.add(rangeString, true);
        table.getRange().format.autofitColumns();
        table.getRange().format.autofitRows();
        table.name = "Example";

        table.getRange().format.autofitColumns();
        table.getRange().format.autofitRows();

        await context.sync();

      });
    } catch (error) {

    }
  }

  async changeColor(event: any) {
    try {
      await Excel.run(async context => {
        var data = this.getData(event);
        const range = context.workbook.getSelectedRange();
        range.load('address');
        range.format.fill.color = data.color;
        await context.sync();
        console.log(`The range address was ${range.address}.`);
      });
    } catch (error) {

    }
  }


}
