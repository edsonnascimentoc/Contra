import logger from '../utils/logger';
import { AuthRequest } from './auth.middleware';

interface LogRequest {
  method: string;
  originalUrl: string;
  url: string;
  ip?: string;
  socket?: {
    remoteAddress?: string;
  };
  get(name: string): string | undefined;
  user?: {
    id: string;
  };
}

interface LogResponse {
  statusCode: number;
  on(event: string, callback: () => void): this;
}

type NextFunction = (err?: any) => void;

export const requestLogger = (req: any, res: any, next: NextFunction): void => {
  const startTime = Date.now();
  const logReq = req as LogRequest;
  const logRes = res as LogResponse;

  logRes.on('finish', () => {
    const duration = Date.now() - startTime;
    const logData = {
      method: logReq.method,
      url: logReq.originalUrl || logReq.url,
      statusCode: logRes.statusCode,
      duration: `${duration}ms`,
      ip: logReq.ip || logReq.socket?.remoteAddress,
      userAgent: logReq.get('user-agent'),
      userId: (req as AuthRequest).user?.id,
    };

    if (logRes.statusCode >= 500) {
      logger.error('Request failed', logData);
    } else if (logRes.statusCode >= 400) {
      logger.warn('Request error', logData);
    } else {
      logger.info('Request completed', logData);
    }
  });

  next();
};

export const errorLogger = (
  err: Error,
  req: any,
  _res: any,
  next: NextFunction
): void => {
  const logReq = req as LogRequest;
  
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    method: logReq.method,
    url: logReq.originalUrl || logReq.url,
    ip: logReq.ip || logReq.socket?.remoteAddress,
  });

  next(err);
};
