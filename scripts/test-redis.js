import { createClient } from 'redis';

async function testConnection() {
  console.log('Testing Redis connection...');
  const client = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  });

  client.on('error', (err) => {
    console.error('Redis Client Error', err);
    process.exit(1);
  });

  try {
    await client.connect();
    console.log('Successfully connected to Redis!');
    await client.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    process.exit(1);
  }
}

testConnection();
