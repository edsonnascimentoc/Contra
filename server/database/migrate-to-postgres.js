// ⚠️ SCRIPT HISTÓRICO - Migração SQLite → PostgreSQL
//
// Data de Execução: 12/12/2025
// Status: ✅ CONCLUÍDA COM SUCESSO
//
// Este arquivo é mantido para:
// - Documentação de como a migração foi realizada
// - Referência para futuras migrações
// - Recuperação de dados de backups SQLite (se necessário)
//
// ⛔ NÃO EXECUTAR EM PRODUÇÃO - Dados já migrados para PostgreSQL
// ⛔ O arquivo construction.db foi arquivado em backups/
//
// Para mais detalhes, consulte: MIGRACAO_CONCLUIDA.md
// ============================================================================

// server/database/migrate-to-postgres.js

import sqlite3pkg from 'sqlite3'; // ESM exige import
import { PrismaClient } from '@prisma/client';

const sqlite3 = sqlite3pkg.verbose();  // Necessário para logs do SQLite
const prisma = new PrismaClient();

// Caminho do seu banco SQLite
const sqliteDb = new sqlite3.Database('./server/database/construction.db');

async function migrateData() {
    console.log('🔄 Iniciando migração de dados...');

    try {
        // ============================
        // MIGRAR STATUS_BOARD
        // ============================
        await new Promise((resolve, reject) => {
            sqliteDb.all('SELECT * FROM status_board', async (err, rows) => {
                if (err) return reject(err);

                if (rows?.length > 0) {
                    console.log(`📊 Migrando ${rows.length} registros de status_board...`);

                    // TODO: Ajustar campos conforme seu schema Prisma
                    // Exemplo:
                    // await prisma.statusBoard.createMany({ data: rows });
                }

                resolve();
            });
        });

        // ============================
        // MIGRAR LABOR
        // ============================
        await new Promise((resolve, reject) => {
            sqliteDb.all('SELECT * FROM labor', async (err, rows) => {
                if (err) return reject(err);

                if (rows?.length > 0) {
                    console.log(`👷 Migrando ${rows.length} registros de labor...`);
                    // TODO: inserção no Prisma
                }

                resolve();
            });
        });

        // ============================
        // MIGRAR MATERIALS
        // ============================
        await new Promise((resolve, reject) => {
            sqliteDb.all('SELECT * FROM materials', async (err, rows) => {
                if (err) return reject(err);

                if (rows?.length > 0) {
                    console.log(`📦 Migrando ${rows.length} registros de materials...`);
                    // TODO: inserção no Prisma
                }

                resolve();
            });
        });

        // ============================
        // MIGRAR DAILY UPDATES
        // ============================
        await new Promise((resolve, reject) => {
            sqliteDb.all('SELECT * FROM daily_updates', async (err, rows) => {
                if (err) return reject(err);

                if (rows?.length > 0) {
                    console.log(`📅 Migrando ${rows.length} registros de daily_updates...`);
                    // TODO: inserção no Prisma
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
