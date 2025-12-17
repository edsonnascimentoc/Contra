import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// Explicitly load .env from root
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

console.log('Testing connection with DATABASE_URL:', process.env.DATABASE_URL);

const { Client } = pg;

const client = new Client({
  connectionString: process.env.DATABASE_URL
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
    console.error('✗ Erro ao conectar:', error);
    process.exit(1);
  }
}

testConnection();
