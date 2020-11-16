import db from '../../database/config';

export default class Address{
  static async get(cep) {
    try {
      const results = await db.query("SELECT * FROM address WHERE id = $1", [cep]);
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
        RETURNING id;
      `;

      const results = await db.query(sql, values);
      return results.rows[0].id;

    } catch (error) {
      console.log(`Unexpected error: ${error}`);
    }
  }

  static async edit(values) {
    try {
      const sql = `
        UPDATE address SET
          cep = $2,
          street = $3,
          complement = $4,
          district = $5,
          state = $6,
          uf = $7
        WHERE id = $1
      `;

      await db.query(sql, values);
      return

    } catch (error) {
      console.log(`Unexpected error: ${error}`);
    }
  }

  static remove(id) {
    try {
      return db.query("DELETE FROM address WHERE id = $1", [id]);

    } catch (error) {
      console.log(`Unexpected error: ${error}`);
    }
  }
}