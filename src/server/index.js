var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var server = require('http').Server(app);
var io = require('socket.io')(server, { path: '/io/socket.io' });
var config = require('./config');
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

io.use((socket, next) => {
  let token = socket.handshake.query.token;
  if (isValid(token)) {
    return next();
  }
  return next(new Error('authentication error'));
});
io.on('connection', function (socket) {
  console.log('someone connected');
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

server.listen(config.PORT, () => {
  console.log("Listening on port " + config.PORT);
});


