import express from 'express';
import serverless from 'serverless-http';
import { initializeDatabase } from '../../server/database/init.js';
import statusRoutes from '../../server/routes/status.js';
import laborRoutes from '../../server/routes/labor.js';
import materialsRoutes from '../../server/routes/materials.js';
import dailyUpdatesRoutes from '../../server/routes/dailyUpdates.js';
import authRoutes from '../../server/routes/auth.js';
import { assertRuntimeConfig } from '../../server/utils/runtime-config.js';
import { authenticate } from '../../server/middleware/auth.middleware.js';
import { registerOperationalRoutes } from '../../server/middleware/operational-access.js';
import { setupSecurityMiddleware } from '../../server/middleware/security.middleware.js';

const app = express();

setupSecurityMiddleware(app);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database (only once)
let dbInitialized = false;
async function ensureDbInitialized(_req, _res, next) {
  if (!dbInitialized) {
    try {
      await initializeDatabase();
      dbInitialized = true;
    } catch (error) {
      next(error);
      return;
    }
  }
  next();
}

// Login, refresh and logout are intentionally public routes; each operation
// validates its own credentials or refresh token in the auth router.
app.use('/api/auth', ensureDbInitialized, authRoutes);

registerOperationalRoutes(app, {
  status: statusRoutes,
  labor: laborRoutes,
  materials: materialsRoutes,
  dailyUpdates: dailyUpdatesRoutes,
}, {
  ensureDbInitialized,
  authenticateRequest: authenticate,
});

// Health check
app.get('/api/health', ensureDbInitialized, (_req, res) => {
  res.json({ status: 'OK', message: 'National Group India Construction API (Netlify)' });
});

// Handle 404 for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

const serverlessHandler = serverless(app);

export const handler = (event, context) => {
  assertRuntimeConfig();
  return serverlessHandler(event, context);
};
