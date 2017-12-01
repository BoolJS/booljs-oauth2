'use strict';

const Bool = require('booljs');

let api = new Bool('com.example.api', [
    'booljs.passport',
    'passport-http-bearer', 'passport-http', 'passport-oauth2-client-password',
    require.resolve('..')
]);

api
    .setBase('example')
    .run();

const chai = require('chai');
chai.use(require('chai-as-promised'));

global.expect = chai.expect;
global.Agent = require('supertest');
