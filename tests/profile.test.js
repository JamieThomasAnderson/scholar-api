var request = require('supertest');
var app = require('../app');

const tests = {
    missingParam: '/profile',
    invalidParam: '/profile?invalid=123',
    invalidLength: '/profile?user=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    valid1: '/profile?user=GzBaxPMAAAAJ',
};

describe('Test the profile route', () => {
    test('It should respond with an error for missing user ID', async () => {
        const response = await request(app).get(tests.missingParam);
        expect(response.statusCode).toBe(400);
        expect(response.body).toStrictEqual({ error: 'Missing user ID' });
    });

    test('It should respond with an error for invalid user ID', async () => {
        const response = await request(app).get(tests.invalidParam);
        expect(response.statusCode).toBe(400);
        expect(response.body).toStrictEqual({ error: 'Missing user ID' });
    });

    test('It should respond with an error for invalid user ID length', async () => {
        const response = await request(app).get(tests.invalidLength);
        expect(response.statusCode).toBe(400);
        expect(response.body).toStrictEqual({
            error: 'Invalid user ID length',
        });
    });

    test('It should respond with a citations object with more than one entry', async () => {
        const response = await request(app).get(tests.valid1);
        expect(response.statusCode).toBe(200);
        expect(response.body.profile.articles.length).toBeGreaterThan(1);
    });
});
