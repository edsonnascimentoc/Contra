// server/database/test-postgres.js
import pg from 'pg';

const { Client } = pg;

const client = new Client({
  connectionString: 'postgresql://construction_user:construction_pass_2025@localhost:5432/construction_db?schema=public'
});

async function testConnection() {
  try {
    await client.connect();
    console.log('✓ Conexão com PostgreSQL estabelecida com sucesso!');

    const result = await client.query('SELECT version()');
    console.log('✓ Versão do PostgreSQL:', result.rows[0].version);

    await client.end();
    console.log('✓ Conexão encerrada com sucesso!');
  } catch (error) {
    console.error('✗ Erro ao conectar:', error.message);
    process.exit(1);
  }
}

testConnection();
