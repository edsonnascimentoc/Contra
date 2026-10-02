import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedTestUsers() {
  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, 12);

  const testUsers = [
    { email: 'admin@nationalgroup.in', role: 'ADMIN', firstName: 'Admin', lastName: 'National' },
    { email: 'manager@nationalgroup.in', role: 'MANAGER', firstName: 'Manager', lastName: 'User' },
    { email: 'supervisor@nationalgroup.in', role: 'SUPERVISOR', firstName: 'Supervisor', lastName: 'User' },
    { email: 'worker@nationalgroup.in', role: 'WORKER', firstName: 'Worker', lastName: 'User' },
    { email: 'client@nationalgroup.in', role: 'CLIENT', firstName: 'Client', lastName: 'User' },
  ];

  console.log('🌱 Criando usuários de teste...');

  for (const userData of testUsers) {
    await prisma.user.upsert({
      where: { email: userData.email },
      update: {
        passwordHash: hashedPassword,
        role: userData.role,
        isActive: true,
      },
      create: {
        ...userData,
        passwordHash: hashedPassword,
        isActive: true,
      },
    });
    console.log(`✅ Usuário ${userData.role}: ${userData.email} | Senha: ${password}`);
  }

  await prisma.$disconnect();
  console.log('🎉 Todos os usuários de teste foram criados/atualizados!');
}

seedTestUsers();
