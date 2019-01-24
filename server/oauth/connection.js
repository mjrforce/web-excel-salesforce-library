'use strict'

var jsforce = require('jsforce');
var config = require('../config.js');
var oauth2 = new jsforce.OAuth2(config.OAUTH_SETTINGS);

module.exports = oauth2;
