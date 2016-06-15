'use strict';

const API = require('booljs-api');
const lib = require('./lib/methods');

module.exports = class BoolJSOAuth2 extends API.Middleware {
    constructor(){
        super('booljs-oauth2');
    }

    action(_instance) {
        lib(_instance);
        return (req, res, next) => next();
    }
};
