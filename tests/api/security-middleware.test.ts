import { afterEach, describe, expect, it, vi } from 'vitest';
import express from 'express';
import serverless from 'serverless-http';
import { setupSecurityMiddleware } from '../../server/middleware/security.middleware.js';

describe('security middleware rate limiting', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('returns 429 per instance and does not share the default in-memory counter', async () => {
    vi.stubEnv('RATE_LIMIT_MAX_REQUESTS', '1');
    vi.stubEnv('RATE_LIMIT_WINDOW_MS', '60000');
    vi.stubEnv('ALLOWED_ORIGINS', '');

    const createHandler = () => {
      const app = express();
      setupSecurityMiddleware(app);
      app.get('/api/ping', (_req, res) => res.json({ ok: true }));
      return serverless(app);
    };
    const firstInstance = createHandler();
    const secondInstance = createHandler();
    const event = {
      httpMethod: 'GET',
      path: '/api/ping',
      headers: { 'x-nf-client-connection-ip': '203.0.113.10' },
      body: null,
      isBase64Encoded: false,
    };
    const invoke = (handler: ReturnType<typeof serverless>) => handler(event, {}) as unknown as Promise<{
      statusCode: number;
    }>;

    const first = await invoke(firstInstance);
    const limited = await invoke(firstInstance);
    const otherInstance = await invoke(secondInstance);

    expect(first.statusCode).toBe(200);
    expect(limited.statusCode).toBe(429);
    expect(otherInstance.statusCode).toBe(200);
  });
});
