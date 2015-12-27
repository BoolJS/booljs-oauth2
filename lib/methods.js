'use strict';

module.exports = function (_instance) {
    var OAuth2          = require('oauth2orize')
    ,   server          = OAuth2.createServer()
    ,   app             = _instance.getComponents()
    ,   routes          = app.routes
    ,   configurations  = app.configuration.get('security')
    ,   daoModule       = (
        configurations.oauth2 && configurations.oauth2.dao
    ) || 'OAuth2'
    ,   dao             = (
        app.dao[daoModule] && new app.dao[daoModule]()
    ) || {}
    ,   actualMethods   = Object.keys(dao)
    ,   authMethods     = [ 'token' ];

    authMethods = _.intersection(authMethods, actualMethods);

    var clientSerializer = (user, done) => { done(null, user); };

    server.serializeClient(dao.serializeClient || clientSerializer);
    server.deserializeClient(dao.deserializeClient || clientSerializer);

    for(var _method of authMethods){
        dao[_method](server, OAuth2);
    }

    var authRoutes = {
        token: {
            authentication: {
                strategy: 'clientPassword'
            },
            action: [
                server.token(),
                server.errorHandler()
            ]
        },

    };

    var oAuthRoutes = _(authMethods).map(function (method) {
        return _.extend({
            method: 'post',
            url: `/auth/${method}`
        }, authRoutes[method]);
    });

    var Component = (app) => { return oAuthRoutes; };

    _instance.insertComponent('OAuth2', function () {
        return new Component(_instance.getComponents());
    }, routes);
};
