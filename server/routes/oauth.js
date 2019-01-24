var express = require('express');
var oauth2 = require('../oauth/connection.js');
var router = express.Router();

const util = require('util');

/* GET home page. */
router.get('/auth', function (req, res, next) {
    res.redirect(oauth2.getAuthorizationUrl({ scope: 'api id web' }));
});

router.get('/callback', function (req, res, next) {
    var conn = new jsforce.Connection({ oauth2: oauth2 });
    var code = req.param('code');
    conn.authorize(code, function (err, userInfo) {
        if (err) {
            return console.error(err);
        }
        conn.userId = userInfo.id;
        conn.orgId = userInfo.organizationId;
        conn.layout = 'blank';
        conn.title = 'Callback';
        res.render('callback', conn);
    });
});

module.exports = router;
