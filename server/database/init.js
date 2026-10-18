import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const initializeDatabase = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Connected to PostgreSQL database via Prisma');
    console.log('✅ Database initialized successfully');
  } catch {
    console.error('Database connection failed. Check DATABASE_URL and database availability.');
    throw new Error('Database connection failed.');
  }
};

export { prisma as db };
