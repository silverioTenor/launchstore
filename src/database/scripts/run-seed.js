import faker from 'faker';
import { hash } from 'bcryptjs';

import Address from '../../app/models/Address';
import User from '../../app/models/User';
import Product from '../../app/models/Product';
import File from '../../app/models/File';
import FilesManager from '../../app/models/FilesManager';

function seed() {
  async function createAddress() {
    const addrs = [];

    while (addrs.length < 5) {
      addrs.push({
        cep: faker.address.zipCode("########"),
        street: faker.address.streetAddress(true),
        complement: faker.address.secondaryAddress(),
        district: faker.address.city(),
        state: faker.address.state(),
        uf: faker.address.stateAbbr()
      });
    }

    const addrDB = new Address();
    const addrsPromise = addrs.map(addr => addrDB.create(addr));
    const addrsIDs = await Promise.all(addrsPromise);

    return addrsIDs;
  }

  async function createUsers(listIDs) {
    const users = [];
    const password = await hash('123', 8);

    while (users.length < 5) {
      users.push({
        name: faker.name.firstName(),
        email: faker.internet.email(),
        password,
        cpf_cnpj: faker.random.number(9999999999),
        address_id: listIDs[Math.floor(Math.random() * listIDs.length)]
      });
    }

    const userDB = new User();
    const usersPromise = users.map(user => userDB.create(user));
    const usersIDs = await Promise.all(usersPromise);

    return usersIDs;
  }

  async function createProducts(listIDs) {
    const products = [];
    const condition = ['good', 'very_good', 'excelent'];
    const storage = ['64GB', '128GB', '1TB'];
    const price = Math.ceil(faker.commerce.price(80000, 400000, 2));

    while (products.length < 10) {
      products.push({
        user_id: listIDs[Math.floor(Math.random() * listIDs.length)],
        color: faker.commerce.color(),
        brand: faker.commerce.product(),
        model: faker.commerce.productName(),
        condition: condition[Math.floor(Math.random() * 3)],
        description: faker.lorem.paragraph(Math.ceil(Math.random() * 5)),
        price,
        old_price: price,
        storage: storage[Math.floor(Math.random() * 3)]
      });
    }

    const productDB = new Product();
    const productsPromise = products.map(product => productDB.create(product));
    const productsIDs = await Promise.all(productsPromise);

    return productsIDs;
  }

  async function createImagesForProducts(listIDs) {
    const fmDB = new FilesManager();
    const fmPromise = listIDs.map(id => fmDB.create({ product_id: id }));
    const fmIDs = await Promise.all(fmPromise);

    const path = ['public/img/common/others/notFound.png'];

    const fileDB = new File();
    fmIDs.forEach(fm => fileDB.create([path, fm]));
  }

  async function init() {
    const addressIDs = await createAddress();

    const usersIDs = await createUsers(addressIDs);

    const productsIDs = await createProducts(usersIDs);

    await createImagesForProducts(productsIDs);
  }

  init();
}

seed();