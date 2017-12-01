'use strict';

const { Middleware } = require('booljs.api');
const lib = require('./lib/methods');

module.exports = class BoolJSOAuth2 extends Middleware {
    constructor () { super('booljs.oauth2'); }

    action (instance) {
        lib(instance);
        return (req, res, next) => next();
    }
};
