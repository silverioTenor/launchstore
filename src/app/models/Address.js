import db from '../../database/config';

export default class Address{
  static async get(cep) {
    try {
      const results = await db.query("SELECT * FROM address WHERE cep = $1", [cep]);
      return results.rows[0];

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

  static async save(values) {
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
      `;

      await db.query(sql, values);
      return

    } catch (error) {
      console.log(`Unexpected error: ${error}`);
    }
  }

  static async edit(values) {
    try {
      const sql = `
        UPDATE address SET
          cep = $1,
          street = $2,
          complement = $3,
          district = $4,
          state = $5,
          uf = $6
        WHERE cep = $1
      `;

      await db.query(sql, values);
      return

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