var express = require('express');
var router = express.Router();
var jsforce = require('jsforce');
var config = require('../config');
const util = require('util');
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({
	extended: true
}));
router.use(bodyParser.json());


router.get('/', function (req, res) {
	res.send('Welcome to Data.');
});

/* GET home page. */
router.get('/config', function (req, res, next) {
	res.json(config);
});

router.post('/unsubscribe', function (req, res, next) {
	var data = req.body;
	console.log(req.body);
	var conn = new jsforce.Connection(data);
	console.log(config.PLATFORM_EVENT);
	conn.streaming.topic(config.PLATFORM_EVENT).unsubscribe(function (data) {
		console.log(JSON.stringify(data));

		req.io.emit('excel-event', { message: data['payload'] });
	});
	res.json({});
});

router.post('/subscribe', function (req, res, next) {
	var data = req.body;
	console.log(req.body);
	var conn = new jsforce.Connection(data);
	console.log(config.PLATFORM_EVENT);
	conn.streaming.topic(config.PLATFORM_EVENT).subscribe(function (data) {
		console.log(JSON.stringify(data));

		req.io.emit('excel-event', { message: data['payload'] });
	});
	res.json({});
});

router.get('/query', function (req, res) {

	var data = req.query;
	var conn = new jsforce.Connection(data.connection);

	conn.query(data.q, function (err, result) {
		if (err) {
			return console.error(err);
		}
		console.log("total : " + result.totalSize);
		console.log("fetched : " + result.records.length);
		res.json(result);
	});
});

module.exports = router;
