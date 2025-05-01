import request from 'supertest';
import app from '../src/app';
import mockingoose from 'mockingoose';
import {Task} from '../src/models/task.model';

describe('Task API', () => {
  it('should create a task', async () => {
    const res = await request(app)
      .post('/tasks/create_task')
      .send({ title: 'Test Task', description: 'Task description' })
      .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MTI0NjNkNGVhMjZkMDQ4ZDY5OGI4YyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0NjAzOTYyNiwiZXhwIjoxNzQ2MDQzMjI2fQ.-btLIaBGf37cdRtKcJUji87gPA_LBkKfDl06VbQDy1w`);
    expect(res.statusCode).toBe(201);
    expect(res.body.task.title).toBe('Test Task');
  });

  it('should retrieve tasks', async () => {
    mockingoose(Task).toReturn([{ title: 'Mock Task' }], 'find');
    const res = await request(app)
      .get('/tasks/get_all_task')
      .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MTI0NjNkNGVhMjZkMDQ4ZDY5OGI4YyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0NjAzOTYyNiwiZXhwIjoxNzQ2MDQzMjI2fQ.-btLIaBGf37cdRtKcJUji87gPA_LBkKfDl06VbQDy1w`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.tasks)).toBe(true);
  });
});