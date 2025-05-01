import request from 'supertest';
import app from '../app';
import jwt from 'jsonwebtoken';

describe('Role-based Access', () => {
  const adminToken = jwt.sign(
    { id: 'mockedAdminId', role: 'admin' },
    process.env.JWT_SECRET || 'your_secret',
    { expiresIn: '1h' }
  );

  const userToken = jwt.sign(
    { id: 'mockedUserId', role: 'user' },
    process.env.JWT_SECRET || 'your_secret',
    { expiresIn: '1h' }
  );

  it('should deny non-admin from deleting task', async () => {
    const res = await request(app)
      .delete('/tasks/delete/6812516d43b62fa2fb9badd2')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(403);
  });

  it('should allow admin to delete task', async () => {
    jest.setTimeout(15000); // Optional: increase test timeout
  
    const res = await request(app)
      .delete('/tasks/delete/6812516d43b62fa2fb9badd2')
      .set('Authorization', `Bearer ${adminToken}`);

  
    expect(res.status).toBe(200);
  });
  
});
