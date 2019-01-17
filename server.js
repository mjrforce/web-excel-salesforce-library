var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static('dist'));
app.use(express.static('node_modules'))

app.listen(app.get('port'), function() {
  console.log("Node app running at localhost:" + app.get('port'));
});

module.exports = app