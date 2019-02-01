var express = require('express');
var router = express.Router();
const oauth = require('./oauth');

router.get('/', function (req, res) {
	res.send('Welcome to API.');
});

router.use('/oauth', oauth);

module.exports = router;
