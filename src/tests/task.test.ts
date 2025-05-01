import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Types } from 'mongoose';
import request from 'supertest';
import app from '../app';
import { Task } from '../models/task.model';
import redisClient from '../utils/redis';
import { Request, Response, NextFunction } from 'express';

// Extend Express Request type
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

// Enhanced Redis mock
jest.mock('../utils/redis', () => ({
  get: jest.fn(),
  set: jest.fn(),
  setEx: jest.fn(),
  del: jest.fn(),
  isOpen: true
}));

const mockedRedis = redisClient as jest.Mocked<typeof redisClient>;

// Mock auth middleware
jest.mock('../middleware/auth.middleware', () => ({
  authenticate: jest.fn((req: Request, _res: Response, next: NextFunction) => {
    req.user = { id: 'mockUserId', role: 'admin' };
    next();
  }),
  authorize: jest.fn(() => (_req: Request, _res: Response, next: NextFunction) => next())
}));

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
  jest.clearAllMocks();
});

beforeEach(async () => {
  await Task.deleteMany({});
  jest.clearAllMocks();
  
  // Reset Redis mocks
  mockedRedis.get.mockReset();
  mockedRedis.set.mockReset();
  mockedRedis.setEx.mockReset();
  mockedRedis.del.mockReset();
});
describe('Task API', () => {
  it('should create a task', async () => {
    // Mock Redis setEx to resolve successfully
    mockedRedis.setEx.mockResolvedValue('OK');

    const res = await request(app)
      .post('/tasks/create_task')
      .send({
        title: 'Test Task',
        description: 'Task description'
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('data'); // Changed from 'task' to 'data'
    expect(res.body.data).toMatchObject({   // Changed from body.task to body.data
      title: 'Test Task'
    });
    expect(res.body.success).toBe(true);    // Also check for success flag
  });

  it('should retrieve tasks', async () => {
    // Create test task directly in DB
    await Task.create({
      title: 'Mock Task',
      description: 'Test desc',
      user: 'mockUserId'
    });

    // Mock cache miss (get returns null) then successful setEx
    mockedRedis.get.mockResolvedValueOnce(null);
    mockedRedis.setEx.mockResolvedValueOnce('OK');

    const res = await request(app).get('/tasks/get_all_task');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data'); // Changed from 'tasks' to 'data'
    expect(res.body.data).toHaveLength(1);   // Changed from body.tasks to body.data
    expect(res.body.data[0]).toHaveProperty('title', 'Mock Task');
    expect(res.body.success).toBe(true);     // Also check for success flag
    expect(res.body.fromCache).toBe(false);  // Check for fromCache flag
  });
});