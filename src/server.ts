import mongoose, { ConnectOptions } from 'mongoose';
import app from './app';
import { connectRedis } from './utils/redis';

const PORT: number = Number(process.env.PORT) || 5000;
const MONGO_URI: string | undefined = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ MONGO_URI environment variable is not defined');
  process.exit(1);
}

// MongoDB connection options with TypeScript typing
const mongoOptions: ConnectOptions = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  retryWrites: true,
  w: 'majority'
};

// Enhanced MongoDB connection handler
const connectToDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI, mongoOptions);
    console.log('✅ MongoDB connected successfully');
    
    // Initialize Redis with error handling
    try {
      await connectRedis();
      console.log('✅ Redis connected successfully');
    } catch (redisError) {
      console.error('❌ Redis connection error:', redisError);
      throw redisError; // Re-throw to trigger the outer catch
    }

    // Start Express server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    // Graceful shutdown handler
    const shutdown = async (signal: NodeJS.Signals): Promise<void> => {
      console.log(`\n${signal} received. Shutting down gracefully...`);
      server.close(async () => {
        await mongoose.connection.close(false);
        console.log('MongoDB connection closed');
        process.exit(0);
      });
    };

    // Register signal handlers
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

// Database connection events with TypeScript typing
mongoose.connection.on('connected', (): void => {
  console.log('Mongoose connected to DB');
});

mongoose.connection.on('error', (err: Error): void => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', (): void => {
  console.log('Mongoose disconnected from DB');
});

// Start the application
connectToDatabase();