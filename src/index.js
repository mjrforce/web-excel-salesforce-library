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

        var currentWorksheet = context.workbook.worksheets.getActiveWorksheet();
		var expensesTable = currentWorksheet.tables.add("A1:D1", true /*hasHeaders*/);
		expensesTable.name = "ExpensesTable";

       expensesTable.getHeaderRowRange().values =
	   [["Date", "Merchant", "Category", "Amount"]];

	expensesTable.rows.add(null, [
	   ["1/1/2017", "The Phone Company", "Communications", "120"],
	   ["1/2/2017", "Northwind Electric Cars", "Transportation", "142.33"],
	   ["1/5/2017", "Best For You Organics Company", "Groceries", "27.9"],
	   ["1/10/2017", "Coho Vineyard", "Restaurant", "33"],
	   ["1/11/2017", "Bellows College", "Education", "350.1"],
	   ["1/15/2017", "Trey Research", "Other", "135"],
	   ["1/15/2017", "Best For You Organics Company", "Groceries", "97.88"]
	]);

    expensesTable.columns.getItemAt(3).getRange().numberFormat = [['€#,##0.00']];


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
			 Office.context.ui.displayDialogAsync(
			   '/oauth2/auth',
			   {height: 45, width: 55},

			   function (result) {
				   dialog = result.value;
				   dialog.addEventHandler(Microsoft.Office.WebExtension.EventType.DialogMessageReceived, processMessage);
			   }
			);
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