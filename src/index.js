/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

import * as OfficeHelpers from '@microsoft/office-js-helpers';

var dialog = null;
// The initialize function must be run each time a new page is loaded

$(document).ready(function () {  
		     $('#run').click(run);
			 $('#open-dialog').click(openDialog);
			 $('#create-table').click(createTable);
});
		   
Office.initialize = (reason) => {
    $('#sideload-msg').hide();
    $('#app-body').show();
	
};

function createTable() {
	console.log('creating table');
   Excel.run(function (context) {

    var sheet = context.workbook.worksheets.getActiveWorksheet();
    // Write the data into the range first 
    var range = sheet.getRange("A1:B3");
    range.values = [["Key", "Value"], ["A", 1], ["B", 2]];

    // Create the table over the range
    var table = sheet.tables.add('A1:B3', true);
    table.name = "Example";

       return context.sync();
   })
   .catch(function (error) {
       console.log("Error: " + error);
       if (error instanceof OfficeExtension.Error) {
           console.log("Debug info: " + JSON.stringify(error.debugInfo));
       }
   });
}

function openDialog() {
			 Office.context.ui.displayDialogAsync('/oauth2/auth');
}

function processMessage(arg) {
    $('#user-name').text(arg.message);
    dialog.close();
}

async function run() {
    try {
            await Excel.run(async context => {
                /**
                 * Insert your Excel code here
                 */
                const range = context.workbook.getSelectedRange();

            // Read the range address
            range.load('address');

            // Update the fill color
            range.format.fill.color = 'yellow';

            await context.sync();
            console.log(`The range address was ${range.address}.`);
            });
        } catch (error) {
            OfficeHelpers.UI.notify(error);
            OfficeHelpers.Utilities.log(error);
        }
}