import db from '../../database/config';

export default class Address{
  static get(id) {
    try {
      return db.query("", [id]);

    } catch (error) {
      console.log(`Unexpected error: ${error}`);
    }
  }

  static getAll() {
    try {
      return db.query("");

    } catch (error) {
      console.log(`Unexpected error: ${error}`);
    }
  }

  static save(values) {
    try {
      const sql = `
      INSERT INTO address (
        cep,
        street,
        complement,
        district,
        state,
        uf
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id;
    `;

      return db.query(sql, values);

    } catch (error) {
      console.log(`Unexpected error: ${error}`);
    }
  }

  static edit(values) {
    try {
      const sql = `
        UPDATE address SET
          cep = $2,
          street = $3,
          complement = $4,
          district = $5,
          state = $6,
          uf = $7
        WHERE cep = $1
      `;

      return db.query(sql, values);
    } catch (error) {
      console.log(`Unexpected error: ${error}`);
    }
  }

  static remove(id) {
    try {
      return db.query("", [id]);

    } catch (error) {
      console.log(`Unexpected error: ${error}`);
    }
  }
}