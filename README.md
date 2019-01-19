# Web Excel Salesforce Library (WESLI)

WESLI is 	
This is an Excel Add In, not a VBA macro. It lives on Heroku, so you can send a workbook created with it to anyone. 

This is a starter project with the following features: 
- **Manifest XML** to sideload into Excel
- **OAuth** into Salesforce
- **Create a table in Excel** from an Account query


## Install Locally

TODO: Confirm still works locally

Open a command prompt and type:

```
npm run dev
```

## Deploy to Heroku

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

## Side Load Manifest.XML into Excel

[Click here for instructions](https://docs.microsoft.com/en-us/office/dev/add-ins/testing/create-a-network-shared-folder-catalog-for-task-pane-and-content-add-ins).

## Tips

Every page in the app needs to initalize Office JavaScript API.

```
<!DOCTYPE html>
<html>
<body>
    <script type="text/javascript" src="https://appsforoffice.microsoft.com/lib/1.1/hosted/office.debug.js"></script>
    <script type="text/javascript" src="/office-ui-fabric-js/dist/js/fabric.js"></script>
	<script>
	Office.initialize = function () {
    // Office is ready           
		Office.context.ui.messageParent('Message from Dialog');
  };
</script>		
</body>
</html>
```

Code Highlights:

1. Each page should include the office js file.
1. Each page should initialize Office, inside of which you can call $(document).ready() if you are using JQuery.

