var request = require('supertest');
var app = require('../app');

const tests = {
    missingParam: '/cite',
    invalidParam: '/cite?invalid=123',
    invalidLength: '/cite?id=1599167771357288883',
    valid1: '/cite?id=15991677713572888831',
};

describe('Test the citation route', () => {
    test('It should respond with an error for missing article ID', async () => {
        const response = await request(app).get(tests.missingParam);
        expect(response.statusCode).toBe(400);
        expect(response.body).toStrictEqual({ error: 'Missing article ID' });
    });

    test('It should respond with an error for invalid article ID', async () => {
        const response = await request(app).get(tests.invalidParam);
        expect(response.statusCode).toBe(400);
        expect(response.body).toStrictEqual({ error: 'Missing article ID' });
    });

    test('It should respond with an error for invalid article ID length', async () => {
        const response = await request(app).get(tests.invalidLength);
        expect(response.statusCode).toBe(400);
        expect(response.body).toStrictEqual({
            error: 'Invalid article ID length',
        });
    });

    test('It should respond with a citations object with more than one entry', async () => {
        const response = await request(app).get(tests.valid1);
        expect(response.statusCode).toBe(200);
        expect(response.body.citations.length).toBeGreaterThan(1);
    });
});
