import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        email: true,
        role: true,
        firstName: true,
        lastName: true
      }
    });
    
    console.log('--- Lista de Usuários no Banco de Dados ---');
    users.forEach(u => {
      console.log(`${u.firstName} ${u.lastName} | ${u.email} | Cargo: ${u.role}`);
    });
    console.log('-------------------------------------------');
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listUsers();
