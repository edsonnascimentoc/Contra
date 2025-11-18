const sqlite3 = require('sqlite3').
    verbose();
const { PrismaClient } = require
    ('@prisma/client');

const prisma = new PrismaClient();
const sqliteDb = new sqlite3.Database
    ('./server/database/construction.db');

async function migrateData() {
    console.log('🔄 Iniciando migração de dados...');

  try {
        // Migrar Status Board
        await new Promise((resolve,
            reject) => {
            sqliteDb.all('SELECT * FROM status_board', async (err,
rows) => {
                if (err) reject(err);
                if (rows && rows.length > 0) {
                    console.log(`📊 Migrando $
{rows.length} registros de
status_board...`);
                    // Adaptar para o schema do                     Prisma
                    // await prisma.project.
                    createMany({ data: rows });
                }
                resolve();
            });
    });

    // Migrar Labor
    await new Promise((resolve,
        reject) => {
        sqliteDb.all('SELECT * FROM labor', async (err, rows) => {
        if (err) reject(err);
        if (rows && rows.length > 0) {
            console.log(`👷 Migrando $
{rows.length} registros de
labor...`);
            // Adaptar para o schema do Prisma
        }
        resolve();
    });
});

// Migrar Materials
await new Promise((resolve,
    reject) => {
    sqliteDb.all('SELECT * FROM materials', async (err, rows)=> {
            if(err) reject(err);
        if(rows && rows.length > 0) {
        console.log(`📦 Migrando $
{rows.length} registros de
materials...`);
        // Adaptar para o schema do Prisma
    }
    resolve();
});
    });

// Migrar Daily Updates
await new Promise((resolve,
    reject) => {
    sqliteDb.all('SELECT * FROM daily_updates', async (err,
rows) => {
        if (err) reject(err);
        if (rows && rows.length > 0) {
            console.log(`📅 Migrando $
{rows.length} registros de
daily_updates...`);

        }
        resolve();
    });
    });

console.log('✅ Migração concluída com sucesso!');
  } catch (error) {
    console.error('❌ Erro na migração: ', error);
  } finally {
    await prisma.$disconnect();
    sqliteDb.close();
}
}

migrateData();
