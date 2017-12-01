'use strict';

const Bool = require('booljs');

describe('OAuth2', () => {
    let agent;

    before(async () => {
        let api = await new Bool('com.example.api').run();
        agent = new Agent(api.server);
    });

    it(`Authenticated request returns 200`, () => (agent
        .post('/auth/token')
        .type('form')
        .send({
            grant_type: 'password',
            client_id: 'client_id',
            client_secret: 'client_secret',
            username: 'username',
            password: 'password'
        })
        .expect(200)
    ));
});
