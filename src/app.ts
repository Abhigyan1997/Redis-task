import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import morgan from 'morgan';
import taskRoutes from './routes/task.routes';
import authRoutes from './routes/auth.routes';
import { errorHandler } from './middleware/error.middleware';
import { logger } from './middleware/logger.middleware';
import { connectRedis } from './utils/redis';
require('dotenv').config(); // Loads variables from .env into process.env


dotenv.config();

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(logger);

// Routes
app.use('/tasks', taskRoutes);
app.use('/auth', authRoutes);

// Error handling
app.use(errorHandler);

export default app;
