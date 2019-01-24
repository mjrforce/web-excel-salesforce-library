var express = require('express');
var router = express.Router();
var app = require('../../server');
const util = require('util');

/* GET home page. */
router.get('/', function (req, res, next) {
	app.socket.emit('event-processed', JSON.stringify({}));
	res.sendStatus(200);
});

module.exports = router;
