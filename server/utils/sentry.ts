import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import type { Express, Request, Response, NextFunction } from 'express';

export const initSentry = (app: Express): void => {
  const sentryDsn = process.env.SENTRY_DSN;

  if (!sentryDsn) {
    console.warn('SENTRY_DSN not configured. Error tracking disabled.');
    return;
  }

  Sentry.init({
    dsn: sentryDsn,
    environment: process.env.NODE_ENV || 'development',
    integrations: [
      nodeProfilingIntegration(),
    ],
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    beforeSend(event, hint) {
      if (event.exception) {
        console.error('Sentry captured exception:', hint.originalException || hint.syntheticException);
      }
      return event;
    },
  });
};

export const sentryErrorHandler = () => {
  return (err: Error, req: Request, res: Response, next: NextFunction) => {
    Sentry.captureException(err);
    next(err);
  };
};

export { Sentry };