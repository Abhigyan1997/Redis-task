import type { Request, Response, NextFunction } from 'express';
import request from 'supertest';
import app from '../app';
import mockingoose from 'mockingoose'; // Default import
import { Task } from '../models/task.model';

// Type extension for Express
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

// Mock auth middleware
jest.mock('../middleware/auth.middleware', () => ({
  authenticate: jest.fn((req: Request, _res: Response, next: NextFunction) => {
    req.user = { id: 'mockUserId', role: 'admin' };
    next();
  }),
  authorize: jest.fn(() => (_req: Request, _res: Response, next: NextFunction) => next())
}));

describe('Task API', () => {
 beforeEach(() => {
  jest.clearAllMocks();
  mockingoose(Task).reset(); // ✅ correct way
});

afterAll(() => {
  mockingoose(Task).reset(); // ✅ correct way
});
  it('should create a task', async () => {
    const mockData = {
      _id: '507f191e810c19729de860ea',
      title: 'Test Task',
      description: 'Task description',
      user: 'mockUserId'
    };

    mockingoose(Task).toReturn(mockData, 'save');

    const res = await request(app)
      .post('/tasks/create_task')
      .send({
        title: 'Test Task',
        description: 'Task description'
      });

    expect(res.status).toBe(201);
    expect(res.body.task).toMatchObject({
      title: 'Test Task'
    });
  });

  it('should retrieve tasks', async () => {
    const mockData = [{
      _id: '507f191e810c19729de860eb',
      title: 'Mock Task',
      user: 'mockUserId'
    }];

    mockingoose(Task).toReturn(mockData, 'find');

    const res = await request(app)
      .get('/tasks/get_all_task');

    expect(res.status).toBe(200);
    expect(res.body.tasks).toHaveLength(1);
    expect(res.body.tasks[0]).toHaveProperty('title', 'Mock Task');
  });
});