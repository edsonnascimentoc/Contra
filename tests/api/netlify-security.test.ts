import { beforeEach, describe, expect, it, vi } from 'vitest';
import express, { type Request, type Response } from 'express';

vi.mock('../../server/database/init.js', () => ({
  initializeDatabase: vi.fn(),
  db: {},
}));

vi.mock('../../server/middleware/auth.middleware.js', () => ({
  authenticate: (req: any, res: any, next: any) => {
    const role = req.header('x-test-role');
    if (!role) return res.status(401).json({ code: 'AUTH_REQUIRED' });
    req.user = { role };
    next();
  },
  authorize: (...roles: string[]) => (req: any, res: any, next: any) => {
    if (!req.user) return res.status(401).json({ code: 'AUTH_REQUIRED' });
    if (!roles.includes(req.user.role)) return res.status(403).json({ code: 'FORBIDDEN' });
    next();
  },
}));

const stubRouter = async (name: string) => {
  const router = express.Router();
  const respond = (_req: any, res: any) => res.json({ route: name });
  router.get('/', respond);
  router.post('/', respond);
  router.put('/', respond);
  return { default: router };
};

vi.mock('../../server/routes/status.js', async () => stubRouter('status'));
vi.mock('../../server/routes/labor.js', async () => stubRouter('labor'));
vi.mock('../../server/routes/materials.js', async () => stubRouter('materials'));
vi.mock('../../server/routes/dailyUpdates.js', async () => stubRouter('daily-updates'));
vi.mock('../../server/routes/auth.js', async () => {
  const router = express.Router();
  for (const endpoint of ['login', 'refresh', 'logout']) {
    router.post(`/${endpoint}`, (_req: Request, res: Response) => res.status(200).json({ endpoint }));
  }
  return { default: router };
});

describe('Netlify API security', () => {
  let handler: (event: any, context: any) => Promise<any>;

  beforeEach(async () => {
    vi.stubEnv('JWT_SECRET', 'test-only-jwt-secret');
    ({ handler } = await import('../../netlify/functions/api.js'));
  });

  const request = (httpMethod: string, path: string, role?: string) =>
    handler({
      httpMethod,
      path,
      headers: role ? { 'x-test-role': role } : {},
      body: null,
      isBase64Encoded: false,
    }, {});

  it('blocks anonymous access to operational endpoints', async () => {
    const response = await request('GET', '/api/status');

    expect(response.statusCode).toBe(401);
    expect(JSON.parse(response.body).code).toBe('AUTH_REQUIRED');
  });

  it('applies the Express labor role policy by HTTP method', async () => {
    const read = await request('GET', '/api/labor', 'CLIENT');
    const write = await request('POST', '/api/labor', 'CLIENT');

    expect(read.statusCode).toBe(200);
    expect(write.statusCode).toBe(403);
  });

  it('applies the Express materials and daily-update role policies', async () => {
    const deniedRead = await request('GET', '/api/materials', 'WORKER');
    const allowedWrite = await request('PUT', '/api/materials', 'SUPERVISOR');
    const allowedDailyWrite = await request('POST', '/api/daily-updates', 'WORKER');
    const deniedDailyWrite = await request('POST', '/api/daily-updates', 'CLIENT');

    expect(deniedRead.statusCode).toBe(403);
    expect(allowedWrite.statusCode).toBe(200);
    expect(allowedDailyWrite.statusCode).toBe(200);
    expect(deniedDailyWrite.statusCode).toBe(403);
  });

  it('keeps login and refresh routes reachable without an access token', async () => {
    const login = await request('POST', '/api/auth/login');
    const refresh = await request('POST', '/api/auth/refresh');

    expect(login.statusCode).toBe(200);
    expect(refresh.statusCode).toBe(200);
  });
});
