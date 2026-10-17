import { authenticate, authorize } from './auth.middleware.js';

export const operationalRolePolicies = Object.freeze({
  labor: {
    read: ['ADMIN', 'MANAGER', 'CLIENT'],
    write: ['ADMIN', 'MANAGER'],
  },
  materials: {
    read: ['ADMIN', 'MANAGER', 'SUPERVISOR', 'CLIENT'],
    write: ['ADMIN', 'MANAGER', 'SUPERVISOR'],
  },
  dailyUpdates: {
    read: ['ADMIN', 'MANAGER', 'SUPERVISOR', 'WORKER', 'CLIENT'],
    write: ['ADMIN', 'MANAGER', 'SUPERVISOR', 'WORKER'],
  },
});

const passThrough = (_req, _res, next) => next();

export const authorizeOperationalResource = (resource) => {
  const policy = operationalRolePolicies[resource];
  if (!policy) {
    throw new Error(`Unknown operational resource: ${resource}`);
  }

  return (req, res, next) => {
    const roles = req.method === 'GET' ? policy.read : policy.write;
    return authorize(...roles)(req, res, next);
  };
};

export const registerOperationalRoutes = (
  app,
  routes,
  { ensureDbInitialized = passThrough, authenticateRequest = authenticate } = {}
) => {
  app.use('/api/status', ensureDbInitialized, authenticateRequest, routes.status);
  app.use(
    '/api/labor',
    ensureDbInitialized,
    authenticateRequest,
    authorizeOperationalResource('labor'),
    routes.labor
  );
  app.use(
    '/api/materials',
    ensureDbInitialized,
    authenticateRequest,
    authorizeOperationalResource('materials'),
    routes.materials
  );
  app.use(
    '/api/daily-updates',
    ensureDbInitialized,
    authenticateRequest,
    authorizeOperationalResource('dailyUpdates'),
    routes.dailyUpdates
  );
};
