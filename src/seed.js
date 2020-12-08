import faker from 'faker';
import { hash } from 'bcryptjs';

import Address from './app/models/Address';
import User from './app/models/User';

export default async function seed() {
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

  async function createUsers(id) {
    const users = [];
    const password = await hash('123456', 8);

    while (users.length < 1) {
      users.push({
        name: faker.name.firstName(),
        email: faker.internet.email(),
        password,
        cpf_cnpj: faker.random.number(9999999999),
        address_id: id
      });
    }

    const userDB = new User();
    const usersPromise = users.map(user => userDB.create(user));
    const usersIDs = await Promise.all(usersPromise);

    return usersIDs;
  }

  const addressIDs = await createAddress();

  for (const addrID of addressIDs) {
    await createUsers(addrID);
  }
}