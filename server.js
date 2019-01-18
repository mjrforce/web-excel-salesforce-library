var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var path = require('path');
var jsforce = require('jsforce');

app.set('port', (process.env.PORT || 5000));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname + '/dist'));
app.use(bodyParser.json());

var settings = {
    loginUrl: process.env.LOGIN_URL,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI
};
var oauth2 = new jsforce.OAuth2(settings);


app.get('/', function(req, res) {
	console.log(JSON.stringify(req.body));
	var data = req.body;
	var conn = new jsforce.Connection({
	  instanceUrl : data.instanceUrl,
	  accessToken : data.accessToken
	});
	
	conn.query("SELECT Id, Name FROM Account limit 10", function(err, result) {
	  if (err) { return console.error(err); }
	  console.log("total : " + result.totalSize);
	  console.log("fetched : " + result.records.length);
	  res.json(result);
	});

	
});

app.get('/', function(req, res) {
	var loginUrl = oauth2.getAuthorizationUrl({ scope : 'api id web' });
	res.render(__dirname + '/dist/index.html', {loginUrl: loginUrl });
}); 

app.get('', function(req, res) {
	res.render(__dirname + '/dist/index.html', settings);
});

app.get('/oauth2/auth', function(req, res) {
	res.redirect(oauth2.getAuthorizationUrl({ scope : 'api id web' }));
});

app.get('/oauth2/callback', function(req, res) {
  var conn = new jsforce.Connection({ oauth2 : oauth2 });
  var code = req.param('code');
  conn.authorize(code, function(err, userInfo) {
    if (err) { return console.error(err); }
    // Now you can get the access token, refresh token, and instance URL information.
    // Save them to establish connection next time.
    console.log(conn.accessToken);
    console.log(conn.refreshToken);
    console.log(conn.instanceUrl);
	console.log(JSON.stringify(userInfo));
	conn.userId = userInfo.id;
	conn.orgId = userInfo.organizationId;
    console.log("User ID: " + userInfo.id);
    console.log("Org ID: " + userInfo.organizationId);
	res.render(__dirname + '/dist/callback.html', conn);
  });   
});

app.use(express.static('dist'));
app.use(express.static('node_modules'));

app.listen(app.get('port'), function() {
  console.log("Node app running at localhost:" + app.get('port'));
});

module.exports = app;
