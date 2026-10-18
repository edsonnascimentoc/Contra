import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    // Query events can contain refresh tokens and other request data.
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    errorFormat: 'minimal',
});

// Graceful shutdown
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});

export default prisma;
