import { Injectable, Inject, SystemJsNgModuleLoader } from '@angular/core';
import { OfficeDataService } from './office-data-service';
import { APP_BASE_HREF } from '@angular/common';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { getQueryValue } from '@angular/core/src/view/query';

declare const jsforce: any;
declare const WESLI_OAuth_Service: any;

@Injectable({ providedIn: 'root' })
export class DataService {

  constructor(@Inject(APP_BASE_HREF) private baseHref: string,
    private officeService: OfficeDataService) { }

  OauthPromise = new Promise(function (resolve, reject) {
    WESLI_OAuth_Service.getSettings(function (response: any, event: any) {
      if (event.statusCode == '200') {
        resolve(response);
      }
      else {
        reject();
      }
    });
  });

  getLoginUrl() {
    return new Promise(function (resolve, reject) {

      WESLI_OAuth_Service.getloginUrl(function (response: any, event: any) {
        if (event.statusCode == '200') {
          resolve(response);
        }
        else {
          reject();
        }
      });
    });
  }

  getOauth2() {
    return this.OauthPromise.then(function (response) {
      return new jsforce.OAuth2(response);
    });
  }

  getConnection() {
    return this.getOauth2().then(function (oauth2) {
      var conn;
      var oauthresult = this.officeService.getFromLocalStorage('oauthresult');
      if (oauthresult != null && oauthresult != '') {
        var oresult = JSON.parse(oauthresult);
        conn = new jsforce.Connection({ accessToken: oresult.access_token, instanceUrl: oresult.instance_url });
      } else {
        conn = new jsforce.Connection({ oauth2: oauth2 });
      }
      return conn;
    }.bind(this));
  }
  arrayContains(arr: any, str: string) {
    var c = false;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == str) { c = true; }
    }
    return c;
  }

  async query(q: string) {
    return this.getConnection().then(function (conn) {
      var qs = q;
      var p = [];
      var loc = 'A1';
      if (q.search(/ place /i) > -1) {
        p = q.split(/ place /i);
        qs = p[0];
        loc = p[1];
      }
      return conn.query(qs).then(function (result, err) {
        var n = qs.toUpperCase();
        var f = n.substring(7, n.search(/ from /i)).replace(/ /g, '').split(',');
        var o = n.substring(n.search(/ from /i) + 6);
        if (o.search(/ where /i) > -1)
          o = o.substring(0, o.search(/ where /i));
        o = o.trim();
        var table = [];
        table.push(f);
        for(var i=0; i<result.records.length; i++){
          var rmap = this.getRow(result.records[i]);
          var row = [];
          for(var j = 0; j<f.length; j++){
            var a = f[j].split('.');
            var r = this.getValue(rmap, a);
            row.push(r);
          }
          table.push(row);
        }
        var data = { object: o, fieldlist: f, q: qs, result: result, loc: loc, table: table }; 
        console.log('data: ');
        console.log(data);       
        return data;
      }.bind(this));
    }.bind(this));
  }
  
  getValue(rmap, val){
     var t = val;
     var k = t.shift();
     if(t.length > 0){
       return this.getValue(rmap[k.toUpperCase()], t);
     }else{
       return rmap[k.toUpperCase()];
     }
  }
  getRow(record){
    var arr = [];
    for(var property in record){
      if(typeof record[property] == 'object'){
        arr[property.toUpperCase()] = this.getRow(record[property]);  
      }else{
        if(typeof record[property] != 'undefined')
          arr[property.toUpperCase()] = record[property];
      }     
    }
    return arr;
  }

  async globalDescribe() {
    return this.getConnection().then(function (conn) {
      return conn.describeGlobal();
    });
  }

  async describe(object: string) {
    return this.getConnection().then(function (conn) {
      return conn.describe(object);
    });
  }

  async describeObject(data: any) {


    return this.getConnection().then(function (conn) {
      return new Promise(function (resolve, reject) {
        if (typeof data.resolve == 'undefined') {
          data.resolve = resolve;
        }

        var mydata = data;
        mydata.nextObjects = [];

        var promises = [];

        if (typeof mydata.desc == 'undefined') {
          mydata.desc = [];
        }

        if (typeof mydata.objects == 'undefined') {
          mydata.objects = [];
          mydata.objects.push(mydata.object);

        }

        if (typeof mydata.completedObjects == 'undefined') {
          mydata.completedObjects = [];
        }

        for (var i = 0; i < mydata.objects.length; i++) {
          if (this.arrayContains(mydata.completedObjects, mydata.objects[i]) == false) {
            promises.push(conn.sobject(mydata.objects[i]).describe());
            mydata.completedObjects.push(mydata.objects[i]);
          }
        }

        if (promises.length > 0) {

          Promise.all(promises).then(function (data: any) {
            for (var i = 0; i < data.length; i++) {
              data[i].fmap = [];
              for (var j = 0; j < data[i].fields.length; j++) {
                data[i].fmap[data[i].fields[j].name.toUpperCase()] = data[i].fields[j];
                if (data[i].fields[j].type == 'reference') {
                  for (var k = 0; k < data[i].fields[j].referenceTo.length; k++) {
                    var f = data[i].fields[j].referenceTo[k].toUpperCase();
                    if (this.arrayContains(mydata.completedObjects, f) == false &&
                      this.arrayContains(mydata.nextObjects, f) == false) {
                      mydata.nextObjects.push(f);
                    }
                  }
                }
              }
              mydata.desc[data[i].name.toUpperCase()] = data[i];
            }
            return mydata;
          }.bind(this)).then(function (data: any) {
            if (data.nextObjects.length > 0) {
              data.objects = data.nextObjects;
            }
            this.describeObject(data);
          }.bind(this));
        } else {
          data.resolve(mydata);
        }
      }.bind(this));
    }.bind(this));
  }
}
