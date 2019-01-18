var express = require('express');
var app = express();
var path = require('path');
var jsforce = require('jsforce');

app.set('port', (process.env.PORT || 5000));
app.use(express.static('dist'));
app.use(express.static('node_modules'));

var oauth2 = new jsforce.OAuth2({
    loginUrl: process.env.LOGIN_URL,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI
});

var signInUrl = oauth2.getAuthorizationUrl({
        scope: 'api id web'
});

module.exports.signInUrl = signInUrl;

app.get('/oauth2/callback', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/callback.html'));
});

app.listen(app.get('port'), function() {
  console.log("Node app running at localhost:" + app.get('port'));
});

module.exports,app = app;
