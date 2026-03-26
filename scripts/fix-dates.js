// scripts/fix-dates.js  — executar UMA vez antes do deploy
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Iniciando higienização de datas...');
  const entries = await prisma.statusBoard.findMany();
  let fixedCount = 0;
  let manualCheckCount = 0;

  for (const entry of entries) {
    const updates = {};
    const now = new Date();

    // 1. Detecta e corrige ano corrompido (< 2000)
    if (entry.startDate && entry.startDate.getFullYear() < 2000) {
      const corrected = new Date(entry.startDate);
      corrected.setFullYear(corrected.getFullYear() + 2024 - corrected.getFullYear() % 100); // Tenta ajustar para 2024+
      if (corrected.getFullYear() < 2000) corrected.setFullYear(2024); // Fallback seguro
      updates.startDate = corrected;
      console.log(`✅ ID ${entry.id}: startDate corrigida de ${entry.startDate.toISOString()} para ${corrected.toISOString()}`);
    }

    if (entry.endDate && entry.endDate.getFullYear() < 2000) {
      const corrected = new Date(entry.endDate);
      corrected.setFullYear(corrected.getFullYear() + 2024 - corrected.getFullYear() % 100);
      if (corrected.getFullYear() < 2000) corrected.setFullYear(2025); // Fallback seguro (término geralmente > início)
      updates.endDate = corrected;
      console.log(`✅ ID ${entry.id}: endDate corrigida de ${entry.endDate.toISOString()} para ${corrected.toISOString()}`);
    }

    // 2. Preencher datas nulas (pre-requisito para tornar obrigatório no Prisma)
    if (!entry.startDate) {
      updates.startDate = now;
      console.log(`⚠️ ID ${entry.id}: startDate nula preenchida com data atual.`);
    }
    if (!entry.endDate) {
      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 30); // Default 30 dias para frente
      updates.endDate = tomorrow;
      console.log(`⚠️ ID ${entry.id}: endDate nula preenchida com +30 dias.`);
    }

    // 3. Detecta inversão lógica (EndDate <= StartDate)
    const finalStart = updates.startDate || entry.startDate;
    const finalEnd = updates.endDate || entry.endDate;
    if (finalStart && finalEnd && finalEnd <= finalStart) {
      const correctedEnd = new Date(finalStart);
      correctedEnd.setDate(correctedEnd.getDate() + 30); // Força +30 dias para corrigir inversão/igualdade
      updates.endDate = correctedEnd;
      console.log(`✅ ID ${entry.id}: endDate corrigida de ${finalEnd.toISOString()} para ${correctedEnd.toISOString()} (resolvendo inversão/igualdade)`);
    }

    if (Object.keys(updates).length > 0) {
      await prisma.statusBoard.update({
        where: { id: entry.id },
        data: updates
      });
      fixedCount++;
    }
  }

  console.log(`\n--- Resumo ---`);
  console.log(`Total de registros analisados: ${entries.length}`);
  console.log(`Registros corrigidos automaticamente: ${fixedCount}`);
  console.log(`Registros que requerem atenção manual (inversão): ${manualCheckCount}`);
  console.log(`---------------\n`);
}

main()
  .catch((e) => {
    console.error('❌ Erro durante a higienização:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
