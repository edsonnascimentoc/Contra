 // prisma/seed.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    const admin = await prisma.user.upsert({
        where: { email: 'admin@nationalgroup.com' },
        update: {},
        create: {
            email: 'admin@nationalgroup.com',
            passwordHash: '$2b$10$abcdefghijklmnopqrstuvwxyz',
            firstName: 'Admin',
            lastName: 'User',
            role: 'ADMIN',
            isActive: true
        }
    });

    console.log('✅ Admin user created:', admin.email);

    const project = await prisma.project.create({
        data: {
            name: 'Construction Site Alpha',
            description: 'Main construction project',
            status: 'IN_PROGRESS',
            startDate: new Date('2025-01-01'),
            createdById: admin.id
        }
    });

    console.log('✅ Project created:', project.name);

    console.log('🎉 Seeding completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
