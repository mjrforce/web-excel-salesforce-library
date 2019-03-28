import { Component, SystemJsNgModuleLoader } from '@angular/core';
import { Injectable, Inject } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { DataService } from '../services/salesforce-data-service';
import { NgZone } from '@angular/core';

declare const Office: any;
declare const OfficeExtension: any;
declare const Excel: any;

@Injectable({ providedIn: 'root' })
export class ExcelServiceBackup {

  constructor(private dataService: DataService) { }

  charToNumber(val: string) {

    var base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var baseNumber = base.length;

    var runningTotal = 0;
    var characterIndex = 0;
    var indexExponent = val.length - 1;

    while (characterIndex < val.length) {
      var digit = val[characterIndex];
      var digitValue = base.indexOf(digit) + 1;
      runningTotal += Math.pow(baseNumber, indexExponent) * digitValue;

      characterIndex += 1
      indexExponent -= 1
    }

    return runningTotal;
  }

  numberToChar(number: number) {

    var numeric = (number - 1) % 26;
    var letter = String.fromCharCode(65 + numeric);
    var number2 = parseInt(((number - 1) / 26).toString());
    if (number2 > 0) {
      return this.numberToChar(number2) + letter;
    } else {
      return letter;
    }

  }

  getValue(arr: any, key: string) {
    if (key.indexOf('.') > 0) {
      var ks = key.split('.');
      var k = ks.shift();
      return this.getValue(arr[k], ks.join('.'));
    } else {
      return arr[key];
    }
  }
  async getCellValue(a: string) {
    return await Excel.run(async (context) => {
      var sheet = context.workbook.worksheets.getItem(a.split('!')[0]);
      var range = sheet.getRange(a.split('!')[1]);
      range.load(['address', 'values']);
      await context.sync();

      var cellvalue = range.values[0][0];
      if (typeof cellvalue == 'number')
        return cellvalue;
      else
        return '\'' + cellvalue + '\'';
    });
  }

  async fixQuery(q: string) {

    if (q.toUpperCase().indexOf(' WHERE ') > -1) {

      if (q.toUpperCase().indexOf(' EXCEL{{') > -1) {
        var a = q.split(' EXCEL{{');
        var qr = a.shift();
        for (var i = 0; i < a.length; i++) {
          var addr = a[i].split('}}')[0];
          await this.getCellValue(addr).then(function (data) {
            qr += data;
          });

          if (a[i].split('}}').length > 1)
            qr += a[i].split('}}')[1];
        }
        return qr;
      } else {
        return q;
      }
    } else {
      return q;
    }
  }

  parseObject(val: any) {
    var row = [];
    for (var prop in val) {
      if (val.hasOwnProperty(prop)) {
        if (prop != 'attributes') {
          if (typeof val[prop] == 'undefined') {
            row[prop] = "";
          } else if (typeof val[prop] != 'object') {
            row[prop] = val[prop];
          } else if (val[prop] == null) {
            row[prop] = "";
          } else {
            row[prop] = this.parseObject(val[prop]);
          }
        }
      }
    }
    return row;
  }

  async createTable(data: any) {

    try {
      await Excel.run(async context => {
        var h = [];
        for (var i = 0; i < data.fieldlist.length; i++) {
          console.log(data.fieldlist[i]);
          h.push(data.fieldlist[i]);
        }

        var sheetData = [];
        sheetData.push(h);

        var rangeString = "A1:";
        var coloffset = 0;
        var rowoffset = 0;

        if (data.loc != '' && data.loc != null){
          const currRange = context.workbook.getSelectedRange();
          currRange.load('address');
          await context.sync();
          var sheetname = '';
            rangeString = data.loc;
            if (data.loc.indexOf('!') > -1) {
              sheetname = data.loc.split('!')[0];
              rangeString = data.loc.split('!')[1];
            } else {
              sheetname = currRange.address.split('!')[0];
            }
          

          var colString = '';
          var rowstring = '';

          for (var i = 0; i < rangeString.length; i++) {
            var char = rangeString.charAt(i);
            if (isNaN(parseInt(char)) == true)
              colString = colString + char;
            else
              rowstring = rowstring + char;
          }
          coloffset = this.charToNumber(colString) - 1;
          rowoffset = parseInt(rowstring) - 1;
          rangeString = rangeString + ":";
        }

        rangeString = rangeString + this.numberToChar(h.length + coloffset) + (data.result.records.length + 1 + rowoffset);
        for (var i = 0; i < data.result.records.length; i++) {
          var row = [];
          var record = this.parseObject(data.result.records[i]);

          for (var j = 0; j < data.fieldlist.length; j++) {
            var f = data.fieldlist[j];
            var a = f.meta.fullName.split('.');
            var val = record[a[0]];
            for (var k = 1; k < a.length; k++) {
              val = val[a[k]];
            }
            row.push(val);
          }
          sheetData.push(row);
        }

        var sheet = context.workbook.worksheets.getActiveWorksheet();
        if (sheetname.length > 0) {
          sheet = context.workbook.worksheets.getItem(sheetname);
        }
        var range = sheet.getRange(rangeString);


        range.values = sheetData;

        var table = sheet.tables.add(rangeString, true);
        table.name = 'Example';
        await context.sync();
      });
    } catch (error) {
      console.log(error);
    }

  }
}
