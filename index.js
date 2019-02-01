var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var config = require('./src/server/config');
const api = require('./src/server/routes/api');

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(__dirname + '/dist'));
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});
app.use('/api', api);

app.listen(config.PORT, () => {
  console.log('listening on port: ' + config.PORT);
})

