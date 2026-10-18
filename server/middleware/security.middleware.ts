import type { Express } from 'express';
import { getAllowedOrigins as getConfiguredOrigins, setupSecurityMiddleware as setup } from './security.middleware.js';

export const getAllowedOrigins = (configured?: string, environment?: string): string[] =>
  getConfiguredOrigins(configured, environment);

export const setupSecurityMiddleware = (app: Express): void => {
  setup(app);
};
