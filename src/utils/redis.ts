import { createClient } from 'redis';

// Correct Redis URL with host and port
const client = createClient({
  url: 'rediss://sharp-mastiff-28289.upstash.io:6379',  // Remove token from URL here
  password: 'AW6BAAIjcDEwMzMxZTc1ZTRhMTg0ODkzYTY0YjU0MTUyZjQwNWI3YnAxMA',  // Use password option
});

export const connectRedis = async () => {
  client.on('error', (err) => console.error('Redis Client Error', err));

  try {
    await client.connect();  // Connect to Redis
    console.log('Redis connected');
  } catch (err) {
    console.error('Error connecting to Redis:', err);
  }
};

export default client;
