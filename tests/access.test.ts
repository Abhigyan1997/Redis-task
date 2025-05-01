import request from 'supertest';
import app from '../src/app';

describe('Role-based Access', () => {
  it('should deny non-admin from deleting task', async () => {
    const res = await request(app)
      .delete('/tasks/delete/6812516d43b62fa2fb9badd2')
      .set('Authorization', `Bearer non_admin_mock_token`);
    expect(res.statusCode).toBe(403);
  });

  it('should allow admin to delete task', async () => {
    const res = await request(app)
      .delete('/tasks/delete/6812516d43b62fa2fb9badd2')
      .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MTI0NjNkNGVhMjZkMDQ4ZDY5OGI4YyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0NjAzOTYyNiwiZXhwIjoxNzQ2MDQzMjI2fQ.-btLIaBGf37cdRtKcJUji87gPA_LBkKfDl06VbQDy1w`);
    expect(res.statusCode).toBe(200);
  });
});