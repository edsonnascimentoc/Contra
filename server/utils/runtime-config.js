import { assertJwtSecretConfigured } from './auth.js';

export const assertDatabaseUrlConfigured = () => {
  const databaseUrl = process.env.DATABASE_URL;
  if (typeof databaseUrl !== 'string' || !databaseUrl.trim()) {
    throw new Error('DATABASE_URL must be configured before starting the server.');
  }
};

export const assertRuntimeConfig = () => {
  assertJwtSecretConfigured();
  assertDatabaseUrlConfigured();
};
