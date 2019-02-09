import { Component, SystemJsNgModuleLoader } from '@angular/core';
import { Inject } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { DataService } from '../services/salesforce-data-service';
import { NgZone } from '@angular/core';
declare const Office: any;
declare const Excel: any;

export class ExcelService {

  constructor(private dataService: DataService) { }

  convertToColumn(iCol: number) {
    var iCol = 29
    var iAlpha;
    var iRemainder;
    var convertToLetter = '';
    iAlpha = Math.floor(iCol / 27)
    iRemainder = iCol - (iAlpha * 26)
    if (iAlpha > 0) {
      convertToLetter = String.fromCharCode(iAlpha + 64)
    }
    if (iRemainder > 0) {
      convertToLetter = convertToLetter + String.fromCharCode(iRemainder + 64);
    }
    return convertToLetter;
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
  createTable(data: any) {
    var n = data.q.toUpperCase();
    var f = n.substring(7, n.indexOf(" FROM")).replace(/ /g, '').split(',');
    var o = n.substring(n.indexOf("FROM ") + 5);
    if (o.indexOf(' WHERE') > -1)
      o = o.substring(0, o.indexOf(" WHERE"));
    o = o.trim();
    data.object = o;
    data.fieldlist = f;

    this.dataService.globalDescribe(data).then(function (data: any) {


      Excel.run(function (context) {
        let myWorkbook = context.workbook;
        let activeCell = myWorkbook.getActiveCell();

        activeCell.load("address");

        return context.sync().then(function () { console.log('got here'); })


      }).catch(function (error) {
        console.log("Error: " + error);
        if (error) {
          console.log("Debug info: " + JSON.stringify(error.debugInfo));
        }
      });

      Excel.run(function (context) {
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
        console.log('checkbox: ' + data.useCurrentLocation);

        if (data.useCurrentLocation == true) {
          console.log('Current Location: ');
          rangeString = "B1:";
        }

        rangeString = rangeString + this.convertToColumn(h.length) + (data.result.records.length + 1);
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

        return context.sync();
      }).catch(function (error) {
        console.log("Error: " + error);
        if (error instanceof OfficeExtension.Error) {
          console.log("Debug info: " + JSON.stringify(error.debugInfo));
        }
      });
    }.bind(this));
  }
}
