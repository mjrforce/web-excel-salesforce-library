/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

import * as OfficeHelpers from '@microsoft/office-js-helpers';

var dialog = null;
// The initialize function must be run each time a new page is loaded
Office.onReady()
       .then(function() {
           $(document).ready(function () {  
		     $('#run').click(run);
			 $('#sideload-msg').hide();
             $('#app-body').show();
			 Office.context.ui.displayDialogAsync(
			   '/oauth2/auth',
			   {height: 45, width: 55},

			   function (result) {
				   dialog = result.value;
				   dialog.addEventHandler(Microsoft.Office.WebExtension.EventType.DialogMessageReceived, processMessage);
			   }
			);
               

           });
       });

   // TODO2: Create the OK button handler

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