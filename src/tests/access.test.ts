import request from 'supertest';
import app from '../app';
import mongoose, { Types } from 'mongoose';
import jwt from 'jsonwebtoken';
import { Task } from '../models/task.model';
import { MongoMemoryServer } from 'mongodb-memory-server';
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

// Mock Redis
jest.mock('../utils/redis', () => ({
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  isOpen: true
}));

const mockedRedis = redisClient as jest.Mocked<typeof redisClient>;

// Mock JWT tokens
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

// Mock auth middleware
jest.mock('../middleware/auth.middleware', () => ({
  authenticate: jest.fn((req: Request, _res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token === adminToken) {
      req.user = { id: 'mockedAdminId', role: 'admin' };
    } else if (token === userToken) {
      req.user = { id: 'mockedUserId', role: 'user' };
    }
    next();
  }),
  authorize: jest.fn((roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  })
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
});

describe('Role-based Access Control', () => {
  it('should deny a non-admin user from deleting a task', async () => {
    const taskId = new Types.ObjectId();
    await Task.create({
      _id: taskId,
      title: 'User Task',
      description: 'Should not be deletable by non-admin',
      user: 'mockedAdminId'
    });

    const res = await request(app)
      .delete(`/tasks/delete/${taskId.toString()}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe('Access denied');
  });

  it('should allow an admin user to delete a task', async () => {
    const taskId = new Types.ObjectId();
    await Task.create({
      _id: taskId,
      title: 'Admin Task',
      description: 'Should be deletable by admin',
      user: 'mockedAdminId'
    });

    mockedRedis.del.mockResolvedValue(1);

    const res = await request(app)
      .delete(`/tasks/delete/${taskId.toString()}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Task deleted successfully');
  });
});