import faker from 'faker';
import bcryptjs from 'bcryptjs';
import ora from 'ora';
import chalk from 'chalk';

import Address from '../../app/models/Address.js';
import User from '../../app/models/User.js';
import Product from '../../app/models/Product.js';
import File from '../../app/models/File.js';
import FilesManager from '../../app/models/FilesManager.js';

import { styles, createProgressBar, validateDBConnection } from './db-utils.js';

const log = console.log;
const success = chalk.greenBright;
const error = chalk.redBright;
const info = chalk.cyanBright;
const title = chalk.yellow.bold;

log(title('\n🚀 Iniciando processo de seed...\n'));

const spinner = ora();

const timeout = setTimeout(() => {
  log(error('\n⏰ Tempo limite de execução atingido (5 segundos).'));
  log(error('⚠️ Encerrando processo de seed...'));
  process.exit(1);
}, 5000); // Remove ou ajuste o timeout se quiser

async function createAddress() {
  spinner.start(info(styles.underline('Criando endereços...')));
  const addrs = [];

  while (addrs.length < 5) {
    addrs.push({
      cep: faker.address.zipCode('########'),
      street: faker.address.streetAddress(true),
      complement: faker.address.secondaryAddress(),
      district: faker.address.city(),
      state: faker.address.state(),
      uf: faker.address.stateAbbr(),
    });
  }

  const addrDB = new Address();
  const addrsPromise = addrs.map((addr) => addrDB.create(addr));
  const addrsIDs = await Promise.all(addrsPromise);

  spinner.succeed(success('Endereços criados com sucesso.'));
  return addrsIDs;
}

async function createUsers(listIDs) {
  spinner.start(info(styles.underline('Criando usuários...')));
  const users = [];
  const password = await bcryptjs.hash('123', 8);

  while (users.length < 5) {
    users.push({
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password,
      cpf_cnpj: faker.random.number(9999999999).toString(),
      address_id: listIDs[Math.floor(Math.random() * listIDs.length)],
    });
  }

  const userDB = new User();
  const usersPromise = users.map((user) => userDB.create(user));
  const usersIDs = await Promise.all(usersPromise);

  spinner.succeed(success('Usuários criados com sucesso.'));
  return usersIDs;
}

async function createProducts(listIDs) {
  spinner.start(info(styles.underline('Criando produtos...')));
  const products = [];
  const condition = ['good', 'very_good', 'excelent'];
  const storage = ['64GB', '128GB', '1TB'];

  while (products.length < 10) {
    const price = Math.ceil(faker.commerce.price(80000, 400000, 2));

    products.push({
      user_id: listIDs[Math.floor(Math.random() * listIDs.length)],
      color: faker.commerce.color(),
      brand: faker.commerce.product(),
      model: faker.commerce.productName(),
      condition: condition[Math.floor(Math.random() * condition.length)],
      description: faker.lorem.paragraph(Math.ceil(Math.random() * 5)),
      price,
      old_price: price,
      storage: storage[Math.floor(Math.random() * storage.length)],
    });
  }

  const productDB = new Product();
  const productsPromise = products.map((product) => productDB.create(product));
  const productsIDs = await Promise.all(productsPromise);

  spinner.succeed(success('Produtos criados com sucesso.'));
  return productsIDs;
}

async function createImagesForProducts(listIDs) {
  spinner.start(info(styles.underline('Criando imagens para os produtos...')));

  const fmDB = new FilesManager();
  const fmPromise = listIDs.map((id) => fmDB.create({ product_id: id }));
  const fmIDs = await Promise.all(fmPromise);

  const path = ['public/img/common/others/notFound.png'];

  const fileDB = new File();
  for (const fm of fmIDs) {
    await fileDB.create([path, fm]);
  }

  spinner.succeed(success('Imagens criadas com sucesso.'));
}

async function seed() {
  try {
    await validateDBConnection();

    const progressBar = createProgressBar(4);
    progressBar.start();

    const addressIDs = await createAddress();
    progressBar.increment(25);

    const usersIDs = await createUsers(addressIDs);
    progressBar.increment(25);

    const productsIDs = await createProducts(usersIDs);
    progressBar.increment(25);

    await createImagesForProducts(productsIDs);
    progressBar.increment(25);

    progressBar.stop();
    clearTimeout(timeout);

    log(success('\n✅ Seed concluído com sucesso!\n'));
    process.exit(0);
  } catch (err) {
    clearTimeout(timeout);
    spinner.fail(error('💥 Erro durante o seed.'));
    log(error(err));
    process.exit(1);
  }
}

seed();
