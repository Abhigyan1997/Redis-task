import request from 'supertest';
import app from '../src/app';

describe('User Auth', () => {
  it('should login a user and return token', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'alokabhigyan@ymail.com', password: 'password123' });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});