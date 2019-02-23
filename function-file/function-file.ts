/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

(() => {
  // The initialize function must be run each time a new page is loaded
  Office.initialize = () => {

  };

function login (event: any): void {
    var buttonId = event.source.id;    
    console.log('login: ' + buttonId);
    // save this message//
    event.completed();
}

function logout(event: any): void {
  var buttonId = event.source.id;    
  console.log('logout: '  + buttonId);
  // save this message
  event.completed();
}

})();
