import { Component, SystemJsNgModuleLoader } from '@angular/core';
import { Injectable, Inject } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { DataService } from '../services/salesforce-data-service';
import { NgZone } from '@angular/core';
declare const Office: any;
declare const Excel: any;

@Injectable({ providedIn: 'root' })
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
}
