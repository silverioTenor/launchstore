import db from '../../database/config';

export default class User{
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

  static async getBy(filters) {
    let sql = "SELECT email, cpf_cnpj FROM users";

    Object.keys(filters).map(key => {
      sql = `${sql} ${key}`;

      Object.keys(filters[key]).map(field => {
        sql = `${sql} ${field} = '${filters[key][field]}'`;
      });
    });

    const results = await db.query(sql);
    return results.rows[0];
  }

  static save(values) {
    try {
      const sql = `
      INSERT INTO users (
        name,
        email,
        password,
        cpf_cnpj,
        cep
      ) VALUES ($1, $2, $3, $4, $5)
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
        UPDATE users SET
          name = $2,
          email = $3,
          password = $4,
          cpf_cnpj = $5
        WHERE id = $1
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