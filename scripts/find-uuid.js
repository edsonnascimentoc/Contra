import { db } from '../server/database/init.js';

const targetId = 'e7444dae-6d0c-447a-9796-28a036f1b065';

async function findRecord() {
  const models = [
    'user',
    'project',
    'task',
    'labor',
    'material',
    'dailyUpdate',
    'statusBoard'
  ];

  console.log(`Searching for ID: ${targetId}...`);

  for (const model of models) {
    try {
      // @ts-ignore
      const record = await db[model].findUnique({
        where: { id: targetId }
      });

      if (record) {
        console.log(`\n✅ Found in model: ${model}`);
        console.log(JSON.stringify(record, null, 2));
        return;
      }
    } catch (error) {
      // Ignore errors (e.g. if model doesn't exist or doesn't have 'id' field, though we checked schema)
      // console.error(`Error checking ${model}:`, error.message);
    }
  }

  console.log('\n❌ Record not found in any checked model.');
}

findRecord()
  .catch(console.error)
  .finally(async () => {
    await db.$disconnect();
  });
