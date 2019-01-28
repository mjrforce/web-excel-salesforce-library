//Install express server
var config = require('./config');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var io = require('socket.io')(server);
io.path('/io/socket.io');
var path = require('path');
const api = require('./routes/api');

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);
app.use(function (req, res, next) {
  req.io = io;
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(__dirname + '/dist'));
app.use('/api', api);
var server = require('http').Server(app);
server.listen(config.PORT);

io.on('connection', function (socket) {
  console.log('someone connected');
});



