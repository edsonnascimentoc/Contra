import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import * as Sentry from '@sentry/node';
import fs from 'fs';

import { initializeDatabase } from './database/init.js';
import statusRoutes from './routes/status.js';
import laborRoutes from './routes/labor.js';
import materialsRoutes from './routes/materials.js';
import dailyUpdatesRoutes from './routes/dailyUpdates.js';
import authRoutes from './routes/auth.js';
import { assertJwtSecretConfigured } from './utils/auth.js';
import { registerOperationalRoutes } from './middleware/operational-access.js';
import { setupSecurityMiddleware } from './middleware/security.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = process.env.NODE_ENV || 'development';
const envFile = `.env.${env}`;
const envPath = fs.existsSync(envFile) ? envFile : '.env';
dotenv.config({ path: envPath });

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

const app = express();
const PORT = process.env.PORT || 3001;

async function startServer() {
  assertJwtSecretConfigured();

  setupSecurityMiddleware(app);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Static files
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  // Initialize database
  await initializeDatabase();

  // API Routes
  app.use('/api/auth', authRoutes);

  registerOperationalRoutes(app, {
    status: statusRoutes,
    labor: laborRoutes,
    materials: materialsRoutes,
    dailyUpdates: dailyUpdatesRoutes,
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'National Group India Construction API' });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🏗️  National Group India Construction Server running on port ${PORT}`);
    console.log(`📊 API Health: http://localhost:${PORT}/api/health`);
    console.log('Server is ready to accept connections...');
  });

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server gracefully...');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down server gracefully...');
    process.exit(0);
  });
}

startServer().catch(() => {
  console.error('Server startup failed. Check JWT_SECRET and database connectivity.');
  process.exitCode = 1;
});
