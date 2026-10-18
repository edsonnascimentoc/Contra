import helmet from 'helmet';
import cors from 'cors';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';

const DEVELOPMENT_ORIGINS = ['http://localhost:5173', 'http://localhost:5174'];

const positiveInteger = (value, fallback) => {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

// Netlify's serverless adapter may not populate Express' request.ip. Prefer
// Netlify's platform-provided client IP and retain a stable fallback locally.
const rateLimitKeyGenerator = (request) => ipKeyGenerator(
  request.ip
    || request.headers['x-nf-client-connection-ip']
    || request.socket?.remoteAddress
    || '0.0.0.0'
);

export const getAllowedOrigins = (
  configured = process.env.ALLOWED_ORIGINS,
  environment = process.env.NODE_ENV
) => {
  if (typeof configured === 'string') {
    return configured.split(',').map((origin) => origin.trim()).filter(Boolean);
  }

  return environment === 'production' ? [] : DEVELOPMENT_ORIGINS;
};

export const setupSecurityMiddleware = (app) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const allowedOrigins = new Set(getAllowedOrigins());

  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    hsts: isProduction ? {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    } : false,
  }));

  app.use(cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      return callback(null, allowedOrigins.has(origin));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400,
  }));

  app.use('/api/', rateLimit({
    windowMs: positiveInteger(process.env.RATE_LIMIT_WINDOW_MS, 900000),
    limit: positiveInteger(process.env.RATE_LIMIT_MAX_REQUESTS, 100),
    message: {
      success: false,
      error: 'Too many requests, please try again later',
      code: 'RATE_LIMIT_EXCEEDED',
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: rateLimitKeyGenerator,
  }));

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message: {
      success: false,
      error: 'Too many authentication attempts, please try again later',
      code: 'AUTH_RATE_LIMIT_EXCEEDED',
    },
    skipSuccessfulRequests: true,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: rateLimitKeyGenerator,
  });

  app.use('/api/auth/login', authLimiter);
  app.use('/api/auth/register', authLimiter);
  app.use('/api/auth/refresh', authLimiter);
};
