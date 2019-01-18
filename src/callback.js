(function() {
    "use strict";
    var jsforce = require('jsforce')
    Office.onReady()
        .then(function() {
            $(document).ready(function() {
                var conn = new jsforce.Connection({
                    oauth2: oauth2
                });
                var code = getCode();
                conn.authorize(code, function(err, userInfo) {
                    if (err) {
                        return console.error(err);
                    }
                    // Now you can get the access token, refresh token, and instance URL information.
                    // Save them to establish connection next time.
                    console.log(conn.accessToken);
                    console.log(conn.refreshToken);
                    console.log(conn.instanceUrl);
                    console.log("User ID: " + userInfo.id);
                    console.log("Org ID: " + userInfo.organizationId);
					Office.context.ui.messageParent(JSON.stringify(conn));
                });
            });
        });

    function getCode() {
        var url = window.location.href;
        if (url.indexOf("code=") > 0) {
            queryString = url.substr(url.indexOf('?') + 1);
            return parseQueryString(queryString).code; 
        }else{
			return '';
		}
    }

    function parseQueryString(queryString) {
        var qs = decodeURIComponent(queryString),
            obj = {},
            params = qs.split('&');
        params.forEach(function(param) {
            var splitter = param.split('=');
            obj[splitter[0]] = splitter[1];
        });
        return obj;
    }


});