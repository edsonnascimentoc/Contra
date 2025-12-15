import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 Starting seed...');
  
  try {
    await prisma.labor.createMany({
      data: [
        {
          name: 'João Silva',
          type: 'STAFF',
          status: 'ACTIVE',
          designation: 'Engenheiro Civil',
          department: 'Engenharia',
          contact: '11999999999',
          dailyRate: 500
        },
        {
          name: 'Maria Santos',
          type: 'CONTRACT',
          status: 'ACTIVE',
          designation: 'Mestre de Obras',
          department: 'Construção',
          contact: '11888888888',
          dailyRate: 350
        },
        {
          name: 'Pedro Costa',
          type: 'STAFF',
          status: 'ACTIVE',
          designation: 'Arquiteto',
          department: 'Projetos',
          contact: '11777777777',
          dailyRate: 450
        },
        {
          name: 'Carlos Oliveira',
          type: 'NMT',
          status: 'ACTIVE',
          designation: 'Pedreiro',
          department: 'Construção',
          contact: '11666666666',
          dailyRate: 200
        }
      ]
    });
    
    await prisma.material.createMany({
      data: [
        {
          name: 'Cimento',
          category: 'CONSTRUCTION',
          unit: 'saco',
          quantity: 100,
          costPerUnit: 35.50,
          totalCost: 3550.00,
          supplier: 'Fornecedor A',
          status: 'DELIVERED'
        },
        {
          name: 'Areia',
          category: 'CONSTRUCTION',
          unit: 'm³',
          quantity: 50,
          costPerUnit: 80.00,
          totalCost: 4000.00,
          supplier: 'Fornecedor B',
          status: 'DELIVERED'
        },
        {
          name: 'Brita',
          category: 'CONSTRUCTION',
          unit: 'm³',
          quantity: 30,
          costPerUnit: 90.00,
          totalCost: 2700.00,
          supplier: 'Fornecedor B',
          status: 'IN_USE'
        }
      ]
    });
    
    await prisma.statusBoard.createMany({
      data: [
        {
          projectName: 'Edifício Residencial Alpha',
          phase: 'Fundação',
          status: 'IN_PROGRESS',
          progress: 65,
          startDate: new Date('2024-01-15'),
          endDate: new Date('2024-03-30')
        },
        {
          projectName: 'Edifício Residencial Alpha',
          phase: 'Estrutura',
          status: 'NOT_STARTED',
          progress: 0,
          startDate: new Date('2024-04-01'),
          endDate: new Date('2024-08-30')
        },
        {
          projectName: 'Centro Comercial Beta',
          phase: 'Planejamento',
          status: 'COMPLETED',
          progress: 100,
          startDate: new Date('2023-11-01'),
          endDate: new Date('2023-12-31')
        }
      ]
    });
    
    console.log('✅ Seed completed successfully!');
    console.log('📊 Created:');
    console.log('  - 4 labor records');
    console.log('  - 3 material records');
    console.log('  - 3 status board records');
    
  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  }
}

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
