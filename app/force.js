System.register([], function(exports_1, context_1) {
    /**
     * ForceJS - REST toolkit for Salesforce.com
     * Author: Christophe Coenraets @ccoenraets
     * Version: 0.7.2
     */
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var window, loginURL, appId, apiVersion, oauth, tokenStore, context, serverURL, baseURL, proxyURL, oauthCallbackURL, oauthPlugin, useProxy, getRequestBaseURL, parseQueryString, toQueryString, refreshTokenWithPlugin, refreshTokenWithHTTPRequest, refreshToken, joinPaths, init, discardToken, login, loginWithPlugin, loginWithBrowser, getUserId, getOAuthResult, isAuthenticated, request, query, retrieve, getPickListValues, create, update, del, upsert, apexrest, chatter;
    return {
        setters:[],
        execute: function() {
            window = this.window;
            // To override default, pass loginURL in init(props)
            loginURL = 'https://login.salesforce.com', 
            // The Connected App client Id. Default app id provided - Not for production use.
            // This application supports http://localhost:8200/oauthcallback.html as a valid callback URL
            // To override default, pass appId in init(props)
            appId = '3MVG9fMtCkV6eLheIEZplMqWfnGlf3Y.BcWdOf1qytXo9zxgbsrUbS.ExHTgUPJeb3jZeT8NYhc.hMyznKU92', 
            // The force.com API version to use.
            // To override default, pass apiVersion in init(props)
            apiVersion = 'v35.0', 
            // By default we store fbtoken in sessionStorage. This can be overridden in init()
            tokenStore = {}, 
            // if page URL is http://localhost:3000/myapp/index.html, context is /myapp
            context = window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/")), 
            // if page URL is http://localhost:3000/myapp/index.html, serverURL is http://localhost:3000
            serverURL = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : ''), 
            // if page URL is http://localhost:3000/myapp/index.html, baseURL is http://localhost:3000/myapp
            baseURL = serverURL + context, 
            // Only required when using REST APIs in an app hosted on your own server to avoid cross domain policy issues
            // To override default, pass proxyURL in init(props)
            proxyURL = baseURL, 
            // if page URL is http://localhost:3000/myapp/index.html, oauthCallbackURL is http://localhost:3000/myapp/oauthcallback.html
            // To override default, pass oauthCallbackURL in init(props)
            oauthCallbackURL = baseURL + '/oauthcallback.html', 
            // Whether or not to use a CORS proxy. Defaults to false if app running in Cordova, in a VF page,
            // or using the Salesforce console. Can be overriden in init()
            useProxy = (window.cordova || window.SfdcApp || window.sforce) ? false : true;
            /*
             * Determines the request base URL.
             */
            getRequestBaseURL = function () {
                var url;
                if (useProxy) {
                    url = proxyURL;
                }
                else if (oauth.instance_url) {
                    url = oauth.instance_url;
                }
                else {
                    url = serverURL;
                }
                // dev friendly API: Remove trailing '/' if any so url + path concat always works
                if (url.slice(-1) === '/') {
                    url = url.slice(0, -1);
                }
                return url;
            };
            parseQueryString = function (queryString) {
                var qs = decodeURIComponent(queryString), obj = {}, params = qs.split('&');
                params.forEach(function (param) {
                    var splitter = param.split('=');
                    obj[splitter[0]] = splitter[1];
                });
                return obj;
            };
            toQueryString = function (obj) {
                var parts = [], i;
                for (i in obj) {
                    if (obj.hasOwnProperty(i)) {
                        parts.push(encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]));
                    }
                }
                return parts.join("&");
            };
            refreshTokenWithPlugin = function () {
                return new Promise(function (resolve, reject) {
                    oauthPlugin.authenticate(function (response) {
                        oauth.access_token = response.accessToken;
                        tokenStore.forceOAuth = JSON.stringify(oauth);
                        resolve();
                    }, function () {
                        console.error('Error refreshing oauth access token using the oauth plugin');
                        reject();
                    });
                });
            };
            refreshTokenWithHTTPRequest = function () { return new Promise(function (resolve, reject) {
                if (!oauth.refresh_token) {
                    console.log('ERROR: refresh token does not exist');
                    reject();
                    return;
                }
                var xhr = new XMLHttpRequest(), params = {
                    'grant_type': 'refresh_token',
                    'refresh_token': oauth.refresh_token,
                    'client_id': appId
                }, url = useProxy ? proxyURL : loginURL;
                url = url + '/services/oauth2/token?' + toQueryString(params);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            console.log('Token refreshed');
                            var res = JSON.parse(xhr.responseText);
                            oauth.access_token = res.access_token;
                            tokenStore.forceOAuth = JSON.stringify(oauth);
                            resolve();
                        }
                        else {
                            console.log('Error while trying to refresh token: ' + xhr.responseText);
                            reject();
                        }
                    }
                };
                xhr.open('POST', url, true);
                if (!useProxy) {
                    xhr.setRequestHeader("Target-URL", loginURL);
                }
                xhr.send();
            }); };
            refreshToken = function () {
                if (oauthPlugin) {
                    return refreshTokenWithPlugin();
                }
                else {
                    return refreshTokenWithHTTPRequest();
                }
            };
            joinPaths = function (path1, path2) {
                if (path1.charAt(path1.length - 1) !== '/')
                    path1 = path1 + "/";
                if (path2.charAt(0) === '/')
                    path2 = path2.substr(1);
                return path1 + path2;
            };
            /**
             * Initialize ForceJS
             * @param params
             *  appId (optional)
             *  loginURL (optional)
             *  proxyURL (optional)
             *  oauthCallbackURL (optional)
             *  apiVersion (optional)
             *  accessToken (optional)
             *  instanceURL (optional)
             *  refreshToken (optional)
             */
            exports_1("init", init = function (params) {
                if (params) {
                    appId = params.appId || appId;
                    apiVersion = params.apiVersion || apiVersion;
                    loginURL = params.loginURL || loginURL;
                    oauthCallbackURL = params.oauthCallbackURL || oauthCallbackURL;
                    proxyURL = params.proxyURL || proxyURL;
                    useProxy = params.useProxy === undefined ? useProxy : params.useProxy;
                    if (params.accessToken) {
                        if (!oauth)
                            oauth = {};
                        oauth.access_token = params.accessToken;
                    }
                    if (params.instanceURL) {
                        if (!oauth)
                            oauth = {};
                        oauth.instance_url = params.instanceURL;
                    }
                    if (params.refreshToken) {
                        if (!oauth)
                            oauth = {};
                        oauth.refresh_token = params.refreshToken;
                    }
                }
                console.log("useProxy: " + useProxy);
            });
            /**
             * Discard the OAuth access_token. Use this function to test the refresh token workflow.
             */
            exports_1("discardToken", discardToken = function () {
                delete oauth.access_token;
                tokenStore.forceOAuth = JSON.stringify(oauth);
            });
            /**
             * Login to Salesforce using OAuth. If running in a Browser, the OAuth workflow happens in a a popup window.
             * If running in Cordova container, it happens using the Mobile SDK 2.3+ Oauth Plugin
             */
            exports_1("login", login = function () {
                if (window.cordova) {
                    return loginWithPlugin();
                }
                else {
                    return loginWithBrowser();
                }
            });
            exports_1("loginWithPlugin", loginWithPlugin = function () { return new Promise(function (resolve, reject) {
                document.addEventListener("deviceready", function () {
                    oauthPlugin = window.cordova.require("com.salesforce.plugin.oauth");
                    if (!oauthPlugin) {
                        console.error('Salesforce Mobile SDK OAuth plugin not available');
                        reject('Salesforce Mobile SDK OAuth plugin not available');
                        return;
                    }
                    oauthPlugin.getAuthCredentials(function (creds) {
                        // Initialize ForceJS
                        init({
                            accessToken: creds.accessToken,
                            instanceURL: creds.instanceUrl,
                            refreshToken: creds.refreshToken
                        });
                        resolve();
                    }, function (error) {
                        console.log(error);
                        reject(error);
                    });
                }, false);
            }); });
            exports_1("loginWithBrowser", loginWithBrowser = function () { return new Promise(function (resolve, reject) {
                console.log('loginURL: ' + loginURL);
                console.log('oauthCallbackURL: ' + oauthCallbackURL);
                var loginWindowURL = loginURL + '/services/oauth2/authorize?client_id=' + appId + '&redirect_uri=' + oauthCallbackURL + '&response_type=token';
                document.addEventListener("oauthCallback", function (evt) {
                    var event = evt;
                    // Parse the OAuth data received from Salesforce
                    var url = event.detail, queryString, obj;
                    if (url.indexOf("access_token=") > 0) {
                        queryString = url.substr(url.indexOf('#') + 1);
                        obj = parseQueryString(queryString);
                        oauth = obj;
                        tokenStore.forceOAuth = JSON.stringify(oauth);
                        resolve();
                    }
                    else if (url.indexOf("error=") > 0) {
                        queryString = decodeURIComponent(url.substring(url.indexOf('?') + 1));
                        obj = parseQueryString(queryString);
                        reject(obj);
                    }
                    else {
                        reject({ status: 'access_denied' });
                    }
                });
                window.open(loginWindowURL, '_blank', 'location=no');
            }); });
            /**
             * Gets the user's ID (if logged in)
             * @returns {string} | undefined
             */
            exports_1("getUserId", getUserId = function () { return (typeof (oauth) !== 'undefined') ? oauth.id.split('/').pop() : undefined; });
            /**
             * Get the OAuth data returned by the Salesforce login process
             */
            exports_1("getOAuthResult", getOAuthResult = function () { return oauth; });
            /**
             * Check the login status
             * @returns {boolean}
             */
            exports_1("isAuthenticated", isAuthenticated = function () { return (oauth && oauth.access_token) ? true : false; });
            /**
             * Lets you make any Salesforce REST API request.
             * @param obj - Request configuration object. Can include:
             *  method:  HTTP method: GET, POST, etc. Optional - Default is 'GET'
             *  path:    path in to the Salesforce endpoint - Required
             *  params:  queryString parameters as a map - Optional
             *  data:  JSON object to send in the request body - Optional
             */
            exports_1("request", request = function (obj) { return new Promise(function (resolve, reject) {
                console.log(oauth);
                if (!oauth || (!oauth.access_token && !oauth.refresh_token)) {
                    reject('No access token. Please login and try again.');
                    return;
                }
                var method = obj.method || 'GET', xhr = new XMLHttpRequest(), url = getRequestBaseURL();
                // dev friendly API: Add leading '/' if missing so url + path concat always works
                if (obj.path.charAt(0) !== '/') {
                    obj.path = '/' + obj.path;
                }
                url = url + obj.path;
                if (obj.params) {
                    url += '?' + toQueryString(obj.params);
                }
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if (xhr.status > 199 && xhr.status < 300) {
                            resolve(xhr.responseText ? JSON.parse(xhr.responseText) : undefined);
                        }
                        else if (xhr.status === 401 && oauth.refresh_token) {
                            refreshToken()
                                .then(function () { return request(obj).then(function (data) { return resolve(data); }).catch(function (error) { return reject(error); }); })
                                .catch(function () {
                                console.error(xhr.responseText);
                                var error = xhr.responseText ? JSON.parse(xhr.responseText) : { message: 'Server error while refreshing token' };
                                reject(error);
                            });
                        }
                        else {
                            var error = xhr.responseText ? JSON.parse(xhr.responseText) : { message: 'Server error while executing request' };
                            reject(error);
                        }
                    }
                };
                xhr.open(method, url, true);
                xhr.setRequestHeader("Accept", "application/json");
                xhr.setRequestHeader("Authorization", "Bearer " + oauth.access_token);
                if (obj.contentType) {
                    xhr.setRequestHeader("Content-Type", obj.contentType);
                }
                if (useProxy) {
                    xhr.setRequestHeader("Target-URL", oauth.instance_url);
                }
                xhr.send(obj.data ? JSON.stringify(obj.data) : undefined);
            }); });
            /**
             * Convenience function to execute a SOQL query
             * @param soql
             */
            exports_1("query", query = function (soql) { return request({
                path: '/services/data/' + apiVersion + '/query',
                params: { q: soql }
            }); });
            /**
             * Convenience function to retrieve a single record based on its Id
             * @param objectName
             * @param id
             * @param fields
             */
            exports_1("retrieve", retrieve = function (objectName, id, fields) { return request({
                path: '/services/data/' + apiVersion + '/sobjects/' + objectName + '/' + id,
                params: fields ? { fields: fields } : undefined
            }); });
            /**
             * Convenience function to retrieve picklist values from a SalesForce Field
             * @param objectName
             */
            exports_1("getPickListValues", getPickListValues = function (objectName) { return request({
                path: '/services/data/' + apiVersion + '/sobjects/' + objectName + '/describe'
            }); });
            /**
             * Convenience function to create a new record
             * @param objectName
             * @param data
             */
            exports_1("create", create = function (objectName, data) { return request({
                method: 'POST',
                contentType: 'application/json',
                path: '/services/data/' + apiVersion + '/sobjects/' + objectName + '/',
                data: data
            }); });
            /**
             * Convenience function to update a record. You can either pass the sobject returned by retrieve or query or a simple JavaScript object.
             * @param objectName
             * @param data The object to update. Must include the Id field.
             */
            exports_1("update", update = function (objectName, data) {
                var id = data.Id || data.id, fields = JSON.parse(JSON.stringify(data));
                delete fields.attributes;
                delete fields.Id;
                delete fields.id;
                return request({
                    method: 'POST',
                    contentType: 'application/json',
                    path: '/services/data/' + apiVersion + '/sobjects/' + objectName + '/' + id,
                    params: { '_HttpMethod': 'PATCH' },
                    data: fields
                });
            });
            /**
             * Convenience function to delete a record
             * @param objectName
             * @param id
             */
            exports_1("del", del = function (objectName, id) { return request({
                method: 'DELETE',
                path: '/services/data/' + apiVersion + '/sobjects/' + objectName + '/' + id
            }); });
            /**
             * Convenience function to upsert a record
             * @param objectName
             * @param externalIdField
             * @param externalId
             * @param data
             */
            exports_1("upsert", upsert = function (objectName, externalIdField, externalId, data) { return request({
                method: 'PATCH',
                contentType: 'application/json',
                path: '/services/data/' + apiVersion + '/sobjects/' + objectName + '/' + externalIdField + '/' + externalId,
                data: data
            }); });
            /**
             * Convenience function to invoke APEX REST endpoints
             * @param pathOrParams
             */
            exports_1("apexrest", apexrest = function (pathOrParams) {
                var params;
                if (pathOrParams.substring) {
                    params = { path: pathOrParams };
                }
                else {
                    params = pathOrParams;
                    if (params.path.charAt(0) !== "/") {
                        params.path = "/" + params.path;
                    }
                    if (params.path.substr(0, 18) !== "/services/apexrest") {
                        params.path = "/services/apexrest" + params.path;
                    }
                }
                return request(params);
            });
            /**
             * Convenience function to invoke the Chatter API
             * @param pathOrParams
             */
            exports_1("chatter", chatter = function (pathOrParams) {
                var basePath = "/services/data/" + apiVersion + "/chatter";
                var params;
                if (pathOrParams && pathOrParams.substring) {
                    params = { path: joinPaths(basePath, pathOrParams) };
                }
                else if (pathOrParams && pathOrParams.path) {
                    params = pathOrParams;
                    params.path = joinPaths(basePath, pathOrParams.path);
                }
                else {
                    return new Promise(function (resolve, reject) { return reject("You must specify a path for the request"); });
                }
                return request(params);
            });
        }
    }
});
//# sourceMappingURL=force.js.map