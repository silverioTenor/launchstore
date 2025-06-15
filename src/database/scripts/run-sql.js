import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { styles, createProgressBar, validateDBConnection } from './db-utils.js';
import db from '../config.js';

const log = console.log;

async function executeSQLFile(filePath) {
  await validateDBConnection();

  const sql = fs.readFileSync(filePath, { encoding: 'utf-8' });

  const progress = createProgressBar('Executando SQL');
  progress.start(1, 0);

  try {
    await db.query(sql);
    progress.update(1);
    progress.stop();
    log(styles.success('✅ Script SQL executado com sucesso!'));
  } catch (err) {
    progress.stop();
    log(styles.error('❌ Erro ao executar o script SQL:'), err.message);
  } finally {
    await db.end();
    log(styles.info('🔌 Conexão encerrada.'));
  }
}

const __filename = fileURLToPath(import.meta.url);
const filePath = path.resolve(path.dirname(__filename), '..', 'migrations', 'launchstore.sql');

log(styles.title('\n🚀 Iniciando execução do script SQL...\n'));
await executeSQLFile(filePath);
log(styles.success('\n🏁 Processo concluído.\n'));
