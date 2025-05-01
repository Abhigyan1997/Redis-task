// ✅ Always mock BEFORE imports
jest.mock('../models/user.model', () => ({
  User: {
    findOne: jest.fn().mockResolvedValue({
      _id: 'mockUserId',
      email: 'alokabhigyan65@gmail.com',
      password: 'hashedPassword' // Matches bcrypt.compare input
    })
  }
}));

jest.mock('bcryptjs', () => ({
  compare: jest.fn().mockResolvedValue(true)
}));


// ✅ Now import dependencies AFTER mocks
import request from 'supertest';
import app from '../app';

describe('User Auth', () => {
  it('should login a user and return token', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'alokabhigyan65@gmail.com', password: 'password123' });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
