import request from 'supertest';
import app from '../src/server';

describe.skip('GET /api/activities', () => {
  it('should return 401 if not authenticated', async () => {
    const res = await request(app).get('/api/activities');
    expect(res.status).toBe(401);
  });
});
