import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createTestUser() {
  const email = 'admin@nationalgroup.in';
  const password = 'admin';
  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash: hashedPassword,
      isActive: true
    },
    create: {
      email,
      passwordHash: hashedPassword,
      firstName: 'Admin',
      lastName: 'National',
      role: 'ADMIN',
      isActive: true
    }
  });

  console.log(`✅ Usuário de teste criado/atualizado: ${user.email}`);
  await prisma.$disconnect();
}

createTestUser();
