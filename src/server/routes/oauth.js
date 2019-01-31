var express = require('express');
var router = express.Router();
var jsforce = require('jsforce');
var config = require('../config');
var path = require('path');

var oauth2 = new jsforce.OAuth2(config.OAUTH_SETTINGS);

router.get('/', function (req, res) {
    res.send('Welcome to oauth.');
});

/* GET home page. */
router.get('/auth', function (req, res, next) {
    res.redirect(oauth2.getAuthorizationUrl({ scope: 'api id web' }));
});

router.post('/logout', function (req, res, next) {
    var data = req.body;
    console.log(data);
    var conn = new jsforce.Connection(data);

    conn.logout(function (err) {
        if (err) { return console.error(err); }
        res.json({ success: true });
    });

});

router.get('/authurl', function (req, res, next) {
    var resjson = {};
    resjson.URL = oauth2.getAuthorizationUrl({ scope: 'api id web' });
    res.json(resjson);
});

router.get('/callback', function (req, res, next) {
    var conn = new jsforce.Connection({ oauth2: oauth2 });
    var code = req.param('code');

    conn.authorize(code, function (err, userInfo) {
        if (err) {
            res.send(err.message);
            return console.error(err);
        }
        res.render(path.join(__dirname, '../oauth/callback'), { connection: conn, userInfo: userInfo });
    });
});

module.exports = router;
