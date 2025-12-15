import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const initializeDatabase = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Connected to PostgreSQL database via Prisma');
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Error connecting to database:', error);
    throw error;
  }
};

export { prisma as db };
