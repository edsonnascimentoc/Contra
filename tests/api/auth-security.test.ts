import { afterEach, describe, expect, it, vi } from 'vitest';
import { assertJwtSecretConfigured, generateAccessToken } from '../../server/utils/auth.js';

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
});
