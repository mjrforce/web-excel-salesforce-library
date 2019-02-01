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


	});
	res.json({});
});

router.post('/subscribe', function (req, res, next) {
	var settings = req.body;
	var conn = new jsforce.Connection(settings);
	console.log('Settings: ' + JSON.stringify(settings));
	conn.streaming.topic(config.PLATFORM_EVENT).subscribe(function (data) {
		console.log('Data Received: ' + JSON.stringify(data));
		var message = JSON.parse(data['payload']['Message__c']);
		console.log(message);
		for (var i = 0; i < message.length; i++) {
			console.log('emit message...');
			req.io.emit(message[i].name, { message: message[i] });
		}

	});
	res.json({});
});

router.post('/publish', function (req, res, next) {
	var data = req.body;
	var conn = new jsforce.Connection(data.connection);
	conn.sobject("Excel_Template_Event__e").create({ Template_Name__c: data.template }, function (err, ret) {
		if (err || !ret.success) { return console.error(err, ret); }
		res.json(ret);
	});
});

router.get('/query', function (req, res) {

	var data = req.query;
	var conn = new jsforce.Connection(data.connection);

	conn.query(data.q, function (err, result) {
		if (err) {
			return console.error(err);
		}
		res.json(result);
	});
});

router.post('/start', function (req, res) {

	var data = req.body;
	var conn = new jsforce.Connection(data.connection);

	conn.query("SELECT Id, Name from Excel_Template__c WHERE Name = '" + data.q + "'", function (err, result) {
		if (err) {
			return console.error(err);
		}
		console.log(JSON.stringify(result));
		var records = [];
		for (var i = 0; i < result.records.length; i++) {
			records.push({ Template_Name__c: result.records[i].Id });
		}
		console.log(JSON.stringify(records));
		conn.sobject("Excel_Template_Event__e").create(records, function (err, ret) {
			if (err || !ret.success) { return console.error(err, ret); }
			res.json(ret);
		});
	});
});
////
module.exports = router;
