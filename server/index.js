import express from 'express';
import cors from 'cors';
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
import { authenticate, authorize } from './middleware/auth.middleware.js';

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
  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Static files
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  // Initialize database
  await initializeDatabase();

  // API Routes
  app.use('/api/auth', authRoutes);
  
  // Rotas protegidas com controle granular de acesso
  // ADMIN: Acesso total
  // MANAGER: Gestão de projetos e equipes
  // SUPERVISOR: Acompanhamento diário e supervisão
  // WORKER: Visualização e atualizações básicas
  // CLIENT: Visualização de progresso e relatórios (Apenas Leitura)

  // Status Board: Aberto para todos os usuários autenticados para leitura
  app.use('/api/status', authenticate, statusRoutes);

  // Labor: CLIENT pode visualizar (GET), mas não editar
  app.use('/api/labor', authenticate, (req, res, next) => {
    if (req.method === 'GET') return authorize('ADMIN', 'MANAGER', 'CLIENT')(req, res, next);
    return authorize('ADMIN', 'MANAGER')(req, res, next);
  }, laborRoutes);

  // Materials: CLIENT pode visualizar (GET), mas não editar
  app.use('/api/materials', authenticate, (req, res, next) => {
    if (req.method === 'GET') return authorize('ADMIN', 'MANAGER', 'SUPERVISOR', 'CLIENT')(req, res, next);
    return authorize('ADMIN', 'MANAGER', 'SUPERVISOR')(req, res, next);
  }, materialsRoutes);

  // Daily Updates: CLIENT pode visualizar (GET), mas não editar
  app.use('/api/daily-updates', authenticate, (req, res, next) => {
    if (req.method === 'GET') return authorize('ADMIN', 'MANAGER', 'SUPERVISOR', 'WORKER', 'CLIENT')(req, res, next);
    return authorize('ADMIN', 'MANAGER', 'SUPERVISOR', 'WORKER')(req, res, next);
  }, dailyUpdatesRoutes);

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

startServer().catch(console.error);
