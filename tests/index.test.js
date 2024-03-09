var request = require('supertest');
var app = require('../app'); // path to your app

describe('Test the root path', () => {
    test('It should respond with 200', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
    });
});
