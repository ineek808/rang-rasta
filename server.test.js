const request = require('supertest');
const app = require('./server');

describe('RangRasta API', () => {
    test('GET /api/places returns a list of places', async () => {
        const res = await request(app).get('/api/places');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.places)).toBe(true);
        expect(res.body.places.length).toBeGreaterThan(0);
    });

    test('GET /api/festivals returns a list of festivals', async () => {
        const res = await request(app).get('/api/festivals');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.festivals)).toBe(true);
    });

    test('POST /api/auth/signup requires a name', async () => {
        const res = await request(app).post('/api/auth/signup').send({});
        expect(res.statusCode).toBe(400);
    });

    test('POST /api/auth/signup succeeds with a name', async () => {
        const res = await request(app).post('/api/auth/signup').send({ name: 'Test User' });
        expect(res.statusCode).toBe(200);
        expect(res.body.user.name).toBe('Test User');
        expect(res.body.user.token).toBeDefined();
    });

    test('POST /api/planner/generate returns an itinerary', async () => {
        const res = await request(app).post('/api/planner/generate').send({ days: 2, budget: 8000 });
        expect(res.statusCode).toBe(200);
        expect(res.body.itinerary).toBeDefined();
        expect(Object.keys(res.body.itinerary).length).toBe(2);
    });
});
