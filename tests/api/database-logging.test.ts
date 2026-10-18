import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@prisma/client', () => ({
  PrismaClient: class {
    async $connect() {
      throw new Error('postgresql://user:password@private-host/database');
    }
  },
}));

import { initializeDatabase } from '../../server/database/init.js';

describe('database startup logging', () => {
  afterEach(() => vi.restoreAllMocks());

  it('does not log a connection error that could contain DATABASE_URL', async () => {
    const errorLog = vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(initializeDatabase()).rejects.toThrow('Database connection failed.');

    expect(errorLog).toHaveBeenCalledOnce();
    expect(errorLog).toHaveBeenCalledWith(
      'Database connection failed. Check DATABASE_URL and database availability.'
    );
    expect(JSON.stringify(errorLog.mock.calls)).not.toContain('private-host');
    expect(JSON.stringify(errorLog.mock.calls)).not.toContain('password');
  });
});
