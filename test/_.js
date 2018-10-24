'use strict';

const Bool = require('booljs');

const chai = require('chai');
chai.use(require('chai-as-promised'));

global.expect = chai.expect;
global.Agent = require('supertest');

async function main () {
    try {
        let API = new Bool('com.example.api', [
            '@booljs/express', '@booljs/passport',
            'passport-http-bearer', 'passport-http',
            'passport-oauth2-client-password',
            require.resolve('..')
        ]);

        return API
            .setBase('example')
            .setServerDrivers('booljs.express')
            .run();
    } catch (error) {
        throw error;
    }
}

module.exports = main();
