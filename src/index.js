/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */
import * as OfficeHelpers from '@microsoft/office-js-helpers';
var jsforce = require('jsforce');
var dialog = null;
// The initialize function must be run each time a new page is loaded

var oauth2 = new jsforce.OAuth2({
    loginUrl: process.env.LOGIN_URL,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI
});

$(document).ready(function() {
    $('#run').click(run);
    $('#open-dialog').click(openDialog);
    $('#create-table').click(createTable);
});

var dlg;

Office.initialize = (reason) => {
    $('#sideload-msg').hide();
    $('#app-body').show();
};

function openDialog() {

    var signInUrl = oauth2.getAuthorizationUrl({
        scope: 'api id web'
    });
    console.log(signInUrl);
    Office.context.ui.displayDialogAsync(signInUrl, {
            height: 70,
            width: 40
        },
        function(result) {
			console.log('result: ' + JSON.serialize(result));
            dlg = result.value;
            dlg.addEventHandler("dialogMessageReceived", processMessage);
        });
}

function processMessage(arg) {
    console.log(arg.message);
    dialog.close();
}

function createTable() {
    console.log('creating table');
    Excel.run(function(context) {

            var sheet = context.workbook.worksheets.getActiveWorksheet();
            // Write the data into the range first 
            var range = sheet.getRange("A1:B3");
            range.values = [
                ["Key", "Value"],
                ["A", 1],
                ["B", 2]
            ];

            // Create the table over the range
            var table = sheet.tables.add('A1:B3', true);
            table.name = "Example";

            return context.sync();
        })
        .catch(function(error) {
            console.log("Error: " + error);
            if (error instanceof OfficeExtension.Error) {
                console.log("Debug info: " + JSON.stringify(error.debugInfo));
            }
        });
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