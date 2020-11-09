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
    let sql = "SELECT * FROM users";

    Object.keys(filters).map(key => {
      sql = `${sql} ${key}`;

      Object.keys(filters[key]).map(field => {
        sql = `${sql} ${field} = '${filters[key][field]}'`;
      });
    });

    const results = await db.query(sql);
    return results.rows[0];
  }

  static async save(values) {
    try {
      const sql = `
        INSERT INTO users (
          name,
          email,
          password,
          cpf_cnpj
        ) VALUES ($1, $2, $3, $4)
        RETURNING id;
      `;

      const results = await db.query(sql, values);
      return results.rows[0].id;

    } catch (error) {
      console.log(`Unexpected error: ${error}`);
    }
  }

  static async edit(id, fields) {
    try {
      let sql = `UPDATE users SET`;

      Object.keys(fields).map((key, index, array) => {
        if ((index + 1) < array.length) {
          sql = `${sql}
            ${key} = '${fields[key]}',
          `;
        } else {
          sql = `${sql}
            ${key} = '${fields[key]}'
            WHERE id = ${id}
          `;
        }
      });

      await db.query(sql);
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