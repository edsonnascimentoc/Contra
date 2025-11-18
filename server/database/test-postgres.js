const { PrismaClient } =
    require('@prisma/client');
const prisma = new PrismaClient
    ();

async function testConnection
    () {
    try {
        console.log('🔍 Testando conexão com PostgreSQL...');

    // Testar query simples
    const users = await prisma.
            user.findMany();
        console.log('✅ Conexão OK!Usuários encontrados: ',
users.length);

        // Testar criação
        const testUser = await
            prisma.user.create({
                data: {
                    email: 'test@example.com',
        passwordHash:
                    'test123',
                    firstName: 'Test',
                    lastName: 'User',
                    role: 'WORKER',
                },
            });
        console.log('✅ Criação OK!User ID: ', testUser.id);

    // Deletar teste
    await prisma.user.delete({
            where: {
                id: testUser.
                    id
            }
        });
        console.log('✅ Deleção OK!');

    console.log('🎉 Todos os testes passaram!');
  } catch (error) {
        console.error('❌ Erro:',
            error);
    } finally {
        await prisma.$disconnect();
    }
}

testConnection();
