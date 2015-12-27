'use strict';

var API = require('bool.js/api');

module.exports = new API.Middleware('booljs-oauth2', {
    action: function (_instance) {
        require('./lib/methods')(_instance);
        return function (req, res, next) {
            next();
        };
    }
});
