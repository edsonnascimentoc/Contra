import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.error('Redis Error:', err));

// Only connect if not in a test environment or similar to avoid hanging processes during build if needed
// For now, following the guide directly.
// Note: Top-level await might require ES modules configuration in tsconfig/package.json
// The package.json says "type": "module", so top-level await is supported.
await redisClient.connect();

export default redisClient;
