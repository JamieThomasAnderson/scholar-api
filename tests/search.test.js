var request = require('supertest');
var app = require('../app');

const tests = {
    missingParam: '/search',
    invalidParam: '/search?s=test&p=p',
    validQuery: '/search?q=quantum',
    validQueryYear: '/search?q=quantum&startYear=1900&endYear=2020',
    validQueryYearPage: '/search?q=quantum&startYear=1900&endYear=2020&page=3',
};

describe('Test the search route', () => {
    test('It should respond with a 400 status code and error message for missing search query', async () => {
        const response = await request(app).get(tests.missingParam);
        expect(response.statusCode).toBe(400);
        expect(response.body).toStrictEqual({ error: 'Missing Search Query' });
    });

    test('It should respond with a 400 status code and error message for invalid search query', async () => {
        const response = await request(app).get(tests.invalidParam);
        expect(response.statusCode).toBe(400);
        expect(response.body).toStrictEqual({ error: 'Missing Search Query' });
    });

    test('It should respond with a 200 status code and articles array for valid search query', async () => {
        const response = await request(app).get(tests.validQuery);
        expect(response.statusCode).toBe(200);
        expect(response.body.articles.length).toBeGreaterThan(1);
    });

    test('It should respond with a 200 status code and articles array for valid search query with start and end year', async () => {
        const response = await request(app).get(tests.validQueryYear);
        expect(response.statusCode).toBe(200);
        expect(response.body.articles.length).toBeGreaterThan(1);
    });

    test('It should respond with a 200 status code and articles array for valid search query with start and end year and page number', async () => {
        const response = await request(app).get(tests.validQueryYearPage);
        expect(response.statusCode).toBe(200);
        expect(response.body.articles.length).toBeGreaterThan(1);
    });
});
