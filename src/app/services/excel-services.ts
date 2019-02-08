import { Inject } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { DataService } from '../services/salesforce-data-service';
import { NgZone } from '@angular/core';

declare const Excel: any;

export class ExcelService {

  constructor(
    @Inject(APP_BASE_HREF) private baseHref: string,
    private dataService: DataService,
    private ngZone: NgZone, ) {
  }

  ngOnInit() {
  }

  async asynccreateTable(data: any) {

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
}
