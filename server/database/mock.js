// Mock database para desenvolvimento sem Prisma
export const mockStatusBoard = [
  {
    id: '1',
    projectName: 'Residencial Solaris',
    phase: 'Fundação',
    status: 'Em Progresso',
    progress: 75,
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-03-15'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    projectName: 'Edifício Comercial Center',
    phase: 'Estrutura',
    status: 'Concluído',
    progress: 100,
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-04-01'),
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-04-01')
  },
  {
    id: '3',
    projectName: 'Condomínio Verde Vale',
    phase: 'Acabamento',
    status: 'Em Progresso',
    progress: 45,
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-06-01'),
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01')
  }
];

export const mockLabor = [
  {
    id: '1',
    name: 'João Silva',
    designation: 'Engenheiro Civil',
    department: 'Engenharia',
    contact: 'joao@example.com',
    dailyRate: 500,
    type: 'STAFF',
    status: 'ACTIVE',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'Maria Santos',
    designation: 'Pedreiro',
    department: 'Construção',
    contact: 'maria@example.com',
    dailyRate: 200,
    type: 'CONTRACT',
    status: 'ACTIVE',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

export const mockMaterials = [
  {
    id: '1',
    name: 'Cimento Portland',
    category: 'Materiais Básicos',
    quantity: 1000,
    unit: 'sacos',
    supplier: 'ConstruMart',
    costPerUnit: 25,
    totalCost: 25000,
    deliveryDate: new Date('2024-01-20'),
    status: 'DELIVERED',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '2',
    name: 'Aço CA-50',
    category: 'Aço',
    quantity: 500,
    unit: 'kg',
    supplier: 'Siderúrgica Nacional',
    costPerUnit: 8,
    totalCost: 4000,
    deliveryDate: new Date('2024-02-15'),
    status: 'ORDERED',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  }
];

export const mockDailyUpdates = [
  {
    id: '1',
    date: new Date('2024-01-20'),
    weather: 'Ensolarado',
    workDone: 'Conclusão da fundação do bloco A',
    laborCount: 15,
    issues: 'Nenhum problema reportado',
    photos: '',
    createdBy: '1',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  }
];

// Funções mock para simular operações do banco de dados
export const mockDb = {
  statusBoard: {
    findMany: async ({ where = {}, orderBy = {} } = {}) => {
      console.log('Mock: Buscando status board');
      return mockStatusBoard;
    },
    create: async ({ data }) => {
      console.log('Mock: Criando novo status board', data);
      const newItem = {
        id: String(mockStatusBoard.length + 1),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      mockStatusBoard.push(newItem);
      return newItem;
    },
    update: async ({ where, data }) => {
      console.log('Mock: Atualizando status board', where, data);
      const item = mockStatusBoard.find(item => item.id === where.id);
      if (item) {
        Object.assign(item, data, { updatedAt: new Date() });
        return item;
      }
      throw new Error('Item não encontrado');
    },
    delete: async ({ where }) => {
      console.log('Mock: Deletando status board', where);
      const index = mockStatusBoard.findIndex(item => item.id === where.id);
      if (index !== -1) {
        mockStatusBoard.splice(index, 1);
        return { success: true };
      }
      throw new Error('Item não encontrado');
    }
  },
  labor: {
    findMany: async () => {
      console.log('Mock: Buscando labor');
      return mockLabor;
    }
  },
  materials: {
    findMany: async () => {
      console.log('Mock: Buscando materials');
      return mockMaterials;
    }
  },
  dailyUpdate: {
    findMany: async () => {
      console.log('Mock: Buscando daily updates');
      return mockDailyUpdates;
    }
  }
};

export const initializeDatabase = async () => {
  console.log('🔄 Usando banco de dados mock para desenvolvimento');
  console.log('✅ Banco de dados mock inicializado com sucesso');
  console.log('📊 Status Board:', mockStatusBoard.length, 'itens');
  console.log('👷 Labor:', mockLabor.length, 'itens');
  console.log('📦 Materials:', mockMaterials.length, 'itens');
  console.log('📅 Daily Updates:', mockDailyUpdates.length, 'itens');
};

export { mockDb as db };