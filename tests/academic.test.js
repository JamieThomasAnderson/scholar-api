var request = require('supertest');
var app = require('../app');

const tests = {
    missingParam: '/academic',
    invalidParam: '/academic?invalid=123',
    valid1: '/academic?q=Mark Brown',
};

describe('Test the citation route', () => {
    test('It should respond with an error for missing user ID', async () => {
        const response = await request(app).get(tests.missingParam);
        expect(response.statusCode).toBe(400);
        expect(response.body).toStrictEqual({ error: 'Missing profile query' });
    });

    test('It should respond with an error for missing user ID', async () => {
        const response = await request(app).get(tests.invalidParam);
        expect(response.statusCode).toBe(400);
        expect(response.body).toStrictEqual({ error: 'Missing profile query' });
    });

    test('It should respond with a profiles object with more than one entry', async () => {
        const response = await request(app).get(tests.valid1);
        expect(response.statusCode).toBe(200);
        expect(response.body.profiles.length).toBeGreaterThan(1);
    });
});
