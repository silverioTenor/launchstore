import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import db from '../config.js';

dotenv.config();

async function executeSQLFile(filePath) {
  try {
    console.log('🔗 Conectando ao banco de dados...');
    console.log(`📂 Lendo o arquivo SQL: ${filePath}`);

    const sql = fs.readFileSync(filePath, { encoding: 'utf-8' });

    await db.query(sql);
    console.log('✅ Script SQL executado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao executar o script SQL:', error.message);
  } finally {
    await db.end();
    console.log('🔌 Conexão encerrada');
  }
}

const filePath = path.resolve(__dirname, '..', 'migrations', 'launchstore.sql');

await executeSQLFile(filePath);
