import { afterEach, describe, expect, it, vi } from 'vitest';
import { assertJwtSecretConfigured, generateAccessToken } from '../../server/utils/auth.js';
import { assertDatabaseUrlConfigured, assertRuntimeConfig } from '../../server/utils/runtime-config.js';
import { generateAccessToken as generateLegacyMiddlewareToken } from '../../server/middleware/utils/auth.js';
import { generateAccessToken as generateLegacyDistToken } from '../../server/dist/utils/auth.js';

describe('JWT configuration', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('refuses to issue tokens when JWT_SECRET is missing', () => {
    vi.stubEnv('JWT_SECRET', '');

    expect(() => generateAccessToken({ userId: 'user-1', email: 'user@example.com', role: 'ADMIN' }))
      .toThrow(/JWT_SECRET must be configured/i);
  });

  it('fails the startup configuration check when JWT_SECRET is missing', () => {
    vi.stubEnv('JWT_SECRET', '');

    expect(() => assertJwtSecretConfigured()).toThrow(/JWT_SECRET must be configured/i);
  });

  it('issues tokens with a configured JWT_SECRET', () => {
    vi.stubEnv('JWT_SECRET', 'test-only-secret-value');

    expect(generateAccessToken({ userId: 'user-1', email: 'user@example.com', role: 'ADMIN' })).toEqual(expect.any(String));
  });

  it('keeps legacy JWT import paths from falling back to a default secret', () => {
    vi.stubEnv('JWT_SECRET', '');
    const payload = { userId: 'user-1', email: 'user@example.com', role: 'ADMIN' as const };

    expect(() => generateLegacyMiddlewareToken(payload)).toThrow(/JWT_SECRET must be configured/i);
    expect(() => generateLegacyDistToken(payload)).toThrow(/JWT_SECRET must be configured/i);
  });

  it('fails safely when DATABASE_URL is missing', () => {
    vi.stubEnv('DATABASE_URL', '');

    expect(() => assertDatabaseUrlConfigured()).toThrow(/DATABASE_URL must be configured/i);
    expect(() => assertRuntimeConfig()).toThrow(/JWT_SECRET must be configured/i);
  });

  it('accepts the required configuration without exposing its values', () => {
    vi.stubEnv('JWT_SECRET', 'test-only-secret-value');
    vi.stubEnv('DATABASE_URL', 'postgresql://test:test@localhost:5432/test');

    expect(() => assertRuntimeConfig()).not.toThrow();
  });
});
