import { Injectable, Inject } from '@angular/core';
import { OfficeDataService } from './office-data-service';
import { APP_BASE_HREF } from '@angular/common';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

declare const jsforce: any;
declare const WESLI_OAuth_Service: any;

@Injectable({ providedIn: 'root' })
export class DataService {

  constructor(@Inject(APP_BASE_HREF) private baseHref: string,
    private officeService: OfficeDataService) { }

  OauthPromise = new Promise(function (resolve, reject) {
    console.log('starting javascript remoting');
    WESLI_OAuth_Service.getSettings(function (response: any, event: any) {
      if (event.statusCode == '200') {
        console.log(response);
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
      var conn = new jsforce.Connection({ oauth2: oauth2 });
      return conn;
    });
  }
  arrayContains(arr: any, str: string) {
    var c = false;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == str) { c = true; }
    }
    return c;
  }

  globalDescribe(data: any) {

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
          Promise.all(promises).then(function (data) {
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
          }).then(function (data) {
            if (data.nextObjects.length > 0) {
              data.objects = data.nextObjects;

            } else {

            }
            this.globalDescribe(data);
          });

        } else {
          data.resolve(mydata);

        }
      });

    });
  }
}
