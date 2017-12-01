'use strict';

const _ = require('underscore');
const { Error } = require('booljs.api');
const OAuth2 = require('oauth2orize');

const exists = property => property !== undefined && property !== null;

module.exports = function (instance) {
    let server = OAuth2.createServer();
    let app = instance.getComponents();
    let routes = app.routes;

    let configuration = {};
    if (exists(app.configuration.get('security'))) {
        configuration = app.configuration.get('security').oauth2 || {};
    }

    let moduleName;
    if (exists(configuration)) {
        moduleName = configuration.dao || 'OAuth2';
    }

    let DaoModule;
    if (exists(moduleName)) {
        DaoModule = app.dao[moduleName];
    }

    let dao;
    if (exists(DaoModule) && typeof DaoModule === 'function') {
        dao = new DaoModule();
    }

    if (!exists(dao)) {
        throw new Error(0, 'E_MISSING_OAUTH2_MODULE', [
            'The OAuth2 module inside DAO is missing. Please create it, as',
            'well as the #token function at least'
        ].join(' '));
    }

    let methods = (configuration.methods || [ 'token' ])
        .filter(method => exists(dao[method]));

    let clientSerializer = (user, done) => done(null, user);
    server.serializeClient(dao.serializeClient || clientSerializer);
    server.deserializeClient(dao.deserializeClient || clientSerializer);

    for (let method of methods) {
        dao[method](server, OAuth2);
    }

    let authRoutes = {
        token: {
            authentication: { strategy: [ 'basic', 'clientPassword' ] },
            action: [ server.token(), server.errorHandler() ]
        }
    };

    instance.insertComponent('OAuth2', class Component {
        constructor (app) {
            return methods.map(method => _(authRoutes[method]).extend({
                method: 'post',
                url: `/auth/${method}`,
                cors: true
            }));
        }
    }, routes);
};
