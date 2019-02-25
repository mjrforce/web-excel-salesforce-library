import { Injectable, Inject } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
declare const Office: any;

@Injectable({ providedIn: 'root' })
export class OfficeDataService {

  constructor(@Inject(APP_BASE_HREF) private baseHref: string) { }


  // Stores the settings in the JavaScript APIs for Office property bag.
  saveToPropertyBag(key, value) {

    // Note that Project does not support the settings object.
    // Need to check that the settings object is available before setting.
    if (Office.context.document.settings) {
      Office.context.document.settings.set(key, value);
      Office.context.document.settings.saveAsync(function (asyncResult) {
        if (asyncResult.status == Office.AsyncResultStatus.Failed) {
          console.log('Settings save failed. Error: ' + asyncResult.error.message);
        } else {
          console.log('Settings saved.');
        }
      });
    }
    else {
      var unsupportedError = {
        name: "Error: Feature not supported",
        message: "The settings object is not supported in this host application."
      };
      throw unsupportedError;
    }
  }

  // Retrieves the specified setting value from the JavaScript APIs for Office  property bag using the specified key.
  getFromPropertyBag(key) {

    // Note that Project does not support the settings object.
    // Need to check that the settings object is available before setting.
    if (Office.context.document.settings) {
      var value = null;
      value = Office.context.document.settings.get(key);
      return value;
    }
    else {
      var unsupportedError = {
        name: "Error: Feature not supported",
        message: "The settings object is not supported in this host application."
      };
      throw unsupportedError;
    }
  }

  // Stores the settings as a browser cookie.
  saveToBrowserCookies(key, value) {

    document.cookie = key + "=" + value;
  }

  // Retrieves the specified setting from the browser cookies.
  getFromBrowserCookies(key) {
    var cookies = {};
    var all = document.cookie;
    var value = null;

    if (all === "") { return cookies }
    else {
      var list = all.split("; ");
      for (var i = 0; i < list.length; i++) {
        var cookie = list[i];
        var p = cookie.indexOf("=");
        var name = cookie.substring(0, p);

        if (name == key) {
          value = cookie.substring(p + 1);
          break;
        }
      }

    }
    return value;
  }

  // Stores the settings using local storage (Web Storage that doesn't expire).
  // See http://msdn.microsoft.com/en-us/library/ie/cc197062(v=vs.85).aspx information about localStorage, sessionStorage.
  saveToLocalStorage(_key: string, _value: string) {

    localStorage.setItem(_key, _value)

  }

  // Retrieves the specified setting from local storage (Web Storage that doesn't expire).
  getFromLocalStorage(_key: string) {

    var value = localStorage.getItem(_key);
    return value;
  }

  clearLocalStorage(_key: string) {

    localStorage.removeItem(_key);


  }

  // Stores the settings using session storage (Web Storage limited to the lifetime of the browser window).
  saveToSessionStorage(_key: string, _value: string) {

    sessionStorage.setItem(_key, _value);
  }

  // Retrieves the specified setting from session storage (Web Storage limited to the lifetime of the browser window).
  getFromSessionStorage(_key: string) {

    var value = sessionStorage.getItem(_key);
    return value;
  }

  // Stores the settings in a hidden <div> added to the document.
  saveToDocument(key: string, value: string) {
    var hiddenStorage = null;
    var hiddenName = "hiddenstorage";

    if (document.getElementById(hiddenName) == null) {

      hiddenStorage = document.createElement("div");
      hiddenStorage.setAttribute("id", hiddenName);
      hiddenStorage.setAttribute("style", "display:none;");

      document.body.appendChild(hiddenStorage);
    }
    else {
      hiddenStorage = document.getElementById(hiddenName);
    }

    var keyNode = document.createElement("span");
    keyNode.setAttribute("id", key);

    var valueNode = document.createTextNode(value);
    keyNode.appendChild(valueNode);

    hiddenStorage.appendChild(keyNode);

  }

  // Retrieves the specified setting from a hidden <div> in the document.
  getFromDocument(key: string) {
    var value = null;

    if (document.getElementById(key) != null) {
      var valueNode = document.getElementById(key);
      value = valueNode.innerHTML;
    }

    return value;
  }
}

