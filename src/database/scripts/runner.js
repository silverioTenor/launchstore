import { spawn } from 'node:child_process';

const controller = new AbortController();
const { signal } = controller;

const processo = spawn('nodemon', ['--exit', './seed.js'], {
  stdio: 'inherit',
  signal,
});

console.log('🚀 Iniciando processo de seed...');

setTimeout(() => {
  console.log('\n⏰ Tempo limite de execução atingido (5 segundos).');
  console.log('⚠️ Encerrando processo de seed...');
  controller.abort();
}, 5000); // 5 segundos

processo.on('exit', (code, signal) => {
  if (signal) {
    console.log(`❌ Processo encerrado pelo sinal: ${signal}\n`);
  } else if (code === 0) {
    console.log('✅ Processo concluído com sucesso!\n');
  } else {
    console.log(`❌ Processo finalizado com erro (código: ${code})\n`);
  }
});

processo.on('error', (err) => {
  console.log(`💥 Erro ao iniciar o processo: ${err.message}\n`);
});
