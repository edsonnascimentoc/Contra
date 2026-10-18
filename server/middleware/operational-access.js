import { authenticate, authorize } from './auth.middleware.js';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';

const positiveInteger = (value, fallback) => {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const createOperationalRateLimit = () => rateLimit({
  windowMs: positiveInteger(process.env.OPERATIONAL_RATE_LIMIT_WINDOW_MS, 900000),
  limit: positiveInteger(process.env.OPERATIONAL_RATE_LIMIT_MAX_REQUESTS, 60),
  message: {
    success: false,
    error: 'Too many operational requests, please try again later',
    code: 'OPERATIONAL_RATE_LIMIT_EXCEEDED',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (request) => ipKeyGenerator(
    request.ip
      || request.headers['x-nf-client-connection-ip']
      || request.socket?.remoteAddress
      || '0.0.0.0'
  ),
});

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
  app.use('/api/status', createOperationalRateLimit(), ensureDbInitialized, authenticateRequest, routes.status);
  app.use(
    '/api/labor',
    createOperationalRateLimit(),
    ensureDbInitialized,
    authenticateRequest,
    authorizeOperationalResource('labor'),
    routes.labor
  );
  app.use(
    '/api/materials',
    createOperationalRateLimit(),
    ensureDbInitialized,
    authenticateRequest,
    authorizeOperationalResource('materials'),
    routes.materials
  );
  app.use(
    '/api/daily-updates',
    createOperationalRateLimit(),
    ensureDbInitialized,
    authenticateRequest,
    authorizeOperationalResource('dailyUpdates'),
    routes.dailyUpdates
  );
};
