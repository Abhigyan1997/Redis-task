import { createClient } from 'redis';

const client = createClient({ url: process.env.REDIS_URL });

export const connectRedis = async () => {
  client.on('error', err => console.error('Redis Client Error', err));
  await client.connect();
  console.log('Redis connected');
};

export default client;
