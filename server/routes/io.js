var express = require('express');
var router = express.Router();

const util = require('util');

/* GET home page. */
router.get('/*', function (req, res, next) {
    res.send('ok');
});


module.exports = router;
