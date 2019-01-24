//Install express server
const express = require('express');
const path = require('path');
const app = express();
const oauth2 = require('./server/routes/oauth.js');
const data = require('./server/routes/data.js');
var server = require('http').Server(express);
var io = require('socket.io')(server);


app.use(express.static(__dirname + '/dist'));
app.use('/api/outh2', oauth2);
app.use('/api/data', data);

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + root + '/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 3100);
