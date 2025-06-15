import ora from 'ora';
import chalk from 'chalk';
import cliProgress from 'cli-progress';
import db from '../config.js';

const log = console.log;

const styles = {
  success: chalk.greenBright,
  error: chalk.redBright,
  info: chalk.cyanBright,
  title: chalk.yellow.bold,
  underline: chalk.underline,
};

function createProgressBar(task = 'Processando') {
  return new cliProgress.SingleBar({
    format: `${styles.info(task)} | {bar} | {percentage}% | {value}/{total}`,
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true
  }, cliProgress.Presets.shades_classic);
}

async function validateDBConnection() {
  const spinner = ora(styles.info('Verificando conexão com o banco de dados...')).start();

  try {
    await db.query('SELECT 1');
    spinner.succeed(styles.success('Conexão bem-sucedida com o banco de dados.'));
    return true;
  } catch (err) {
    spinner.fail(styles.error('Falha na conexão com o banco de dados.'));
    log(styles.error(err.message));
    process.exit(1); // Encerra o processo em caso de erro
  }
}

export {
  styles,
  createProgressBar,
  validateDBConnection
};
