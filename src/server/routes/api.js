var express = require('express');
var router = express.Router();
const oauth = require('./oauth');
const data = require('./data');

router.get('/', function (req, res) {
	res.send('Welcome to API.');
});

router.use('/oauth', oauth);
router.use('/data', data);

module.exports = router;
