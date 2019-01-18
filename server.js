var express = require('express');
var app = express();
var path = require('path');

app.set('port', (process.env.PORT || 5000));
app.use(express.static('dist'));
app.use(express.static('node_modules'))

app.get('/oauth2/callback', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/callback.html'));
});

app.listen(app.get('port'), function() {
  console.log("Node app running at localhost:" + app.get('port'));
});

module.exports = app;
