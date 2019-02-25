import { Component, SystemJsNgModuleLoader } from '@angular/core';
import { Injectable, Inject } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { DataService } from '../services/salesforce-data-service';
import { NgZone } from '@angular/core';

declare const Office: any;
declare const OfficeExtension: any;
declare const Excel: any;

@Injectable({ providedIn: 'root' })
export class ExcelService {

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

  parseObject(val: any) {

    var row = [];
    for (var prop in val) {
      if (val.hasOwnProperty(prop)) {
        if (prop != 'attributes') {
          if (typeof val[prop] == 'undefined') {
            row[prop.toUpperCase()] = "";
          } else if (typeof val[prop] != 'object') {
            row[prop.toUpperCase()] = val[prop];
          } else if (val[prop] == null) {
            row[prop.toUpperCase()] = "";
          } else {
            row[prop.toUpperCase()] = this.parseObject(val[prop]);
          }
        }
      }
    }
    return row;
  }

  async createTable(data: any) {

    this.dataService.describeObject(data).then(async function (data: any) {

      try {
        await Excel.run(async context => {
          var h = [];

          for (var i = 0; i < data.fieldlist.length; i++) {

            if (data.fieldlist[i].indexOf('.') > -1) {
              var arr = data.fieldlist[i].split('.');
              var label = '';
              var obj = data.object;

              for (var j = 0; j < arr.length; j++) {
                var f = data.desc[obj].fmap[arr[j]];
                if (typeof f == 'undefined') {
                  f = data.desc[obj].fmap[arr[j] + 'ID'];
                }
                if (typeof f == 'undefined' && arr[j].indexOf('__R') > 0) {
                  f = data.desc[obj].fmap[arr[j].replace('__R', '__C')];
                }
                if (j < arr.length && f.referenceTo.length > 0)
                  obj = f.referenceTo[0].toUpperCase();
                if (j != 0) { label = label + ':'; }
                label = label + f.label;

              }
              h.push(label);
            } else {
              label = data.desc[data.object].fmap[data.fieldlist[i]].label;
              h.push(label);
            }
          }

          var sheetData = [];
          sheetData.push(h);

          var rangeString = "A1:";
          var coloffset = 0;
          var rowoffset = 0;

          if (data.queryForm.currentlocation == true) {
            const currRange = context.workbook.getSelectedRange();
            currRange.load('address');
            await context.sync();
            rangeString = currRange.address.split('!')[1].split(':')[0];
            var colString = '';
            var rowstring = '';
            for (var i = 0; i < rangeString.length; i++) {
              var char = rangeString.charAt(i);
              console.log('Testing: ' + char + ' typeof: ' + typeof char);
              if (isNaN(parseInt(char)) == true)
                colString = colString + char;
              else
                rowstring = rowstring + char;
            }
            coloffset = this.charToNumber(colString) - 1;
            rowoffset = parseInt(rowstring) - 1;
            console.log('rangeString: ' + rangeString);
            console.log('colString: ' + colString);
            console.log('column offset: ' + coloffset);
            console.log('row offset: ' + rowoffset);
            rangeString = rangeString + ":";
          }

          rangeString = rangeString + this.numberToChar(h.length + coloffset) + (data.result.records.length + 1 + rowoffset);
          console.log(rangeString);

          for (var i = 0; i < data.result.records.length; i++) {
            var row = [];
            var record = this.parseObject(data.result.records[i]);

            for (var j = 0; j < data.fieldlist.length; j++) {
              var f = data.fieldlist[j];
              var val = this.getValue(record, f);

              row.push(val);

            }
            sheetData.push(row);
          }

          var sheet = context.workbook.worksheets.getActiveWorksheet();
          var range = sheet.getRange(rangeString);


          range.values = sheetData;

          console.log('table');
          var table = sheet.tables.add(rangeString, true);
          table.name = 'Example';

          console.log('start sync');

          await context.sync();


        });
      } catch (error) {
        console.log(error);
      }
    }.bind(this));
  }
}
