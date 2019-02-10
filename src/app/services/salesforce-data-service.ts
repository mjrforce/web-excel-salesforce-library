import { Injectable, Inject, SystemJsNgModuleLoader } from '@angular/core';
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
      console.log('oauth2: ');
      console.log(response);
      return new jsforce.OAuth2(response);
    });
  }

  getConnection() {
    return this.getOauth2().then(function (oauth2) {
      console.log('Connection: ');
      console.log(oauth2);
      var conn;
      var oauthresult = this.officeService.getFromLocalStorage('oauthresult');
      if (oauthresult != null && oauthresult != '') {
        var oresult = JSON.parse(oauthresult);
        console.log('oresult: ');
        console.log(oresult);
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

  query(q: string) {
    console.log('q: ' + q);
    return this.getConnection().then(function (conn) {
      return conn.query(q).then(function (result, err) {
        var n = q.toUpperCase();
        var f = n.substring(7, n.indexOf(" FROM")).replace(/ /g, '').split(',');
        var o = n.substring(n.indexOf("FROM ") + 5);
        if (o.indexOf(' WHERE') > -1)
          o = o.substring(0, o.indexOf(" WHERE"));
        o = o.trim();
        var data = { object: o, fieldlist: f, q: q, result: result };
        console.log(data);
        return data;
      });
    });
  }

  async globalDescribe(data: any) {

    console.log('get Connection for global describe');
    return this.getConnection().then(function (conn) {
      console.log('Got the connection, now start a new promise');
      return new Promise(function (resolve, reject) {
        console.log('inside the promise...');
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
            console.log('Describing ... ' + mydata.objects[i]);

            promises.push(conn.sobject(mydata.objects[i]).describe());
            mydata.completedObjects.push(mydata.objects[i]);
          }
        }



        if (promises.length > 0) {
          console.log('Look at all these promises...');
          console.log(promises);
          Promise.all(promises).then(function (data: any) {
            console.log('These promises are resolved...');
            console.log(data);
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

            } else {

            }
            console.log('more to do...');
            this.globalDescribe(data);
          }.bind(this));

        } else {
          console.log('All done!');
          data.resolve(mydata);

        }
      }.bind(this));

    }.bind(this));
  }
}
