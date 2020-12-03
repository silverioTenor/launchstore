import db from '../../database/config';

export default class Base {

  constructor() {
    this.table = this;
  }

  async get(val) {
    try {
      const { id, column } = val;

      let sql = `SELECT * FROM ${this.table} WHERE ${column} = ${id}`;

      const results = await db.query(sql);
      return results.rows[0];

    } catch (error) {
      console.log(`Unexpected error in DB GET: ${error}`);
    }
  }

  async getBy(filters) {
    try {
      let sql = `SELECT * FROM ${this.table}`;

      Object.keys(filters).map(key => {
        sql += ` ${key}`;

        Object.keys(filters[key]).map(field => {
          sql += ` ${field} = '${filters[key][field]}'`;
        });
      });

      const results = await db.query(sql);
      return results.rows[0];

    } catch (error) {
      console.log(`Unexpected error in DB GETBY: ${error}`);
    }
  }

  async getAll() {
    try {
      let sql = `SELECT * FROM ${this.table}`;

      const results = await db.query(sql);
      return results.rows;

    } catch (error) {
      console.log(`Unexpected error in DB GETALL: ${error}`);
    }
  }

  async create(fields) {
    try {
      let keys = [],
        values = [];

      Object.keys(fields).map(key => {
        keys.push(key);
        values.push(`'${fields[key]}'`);
      });

      const sql = `INSERT INTO ${this.table} (${keys.join(',')}) VALUES (${values.join(',')}) RETURNING id`;

      const results = await db.query(sql);
      return results.rows[0].id;

    } catch (error) {
      console.log(`Unexpected error in DB CREATE: ${error}`);
    }
  }

  async update(val, fields) {
    try {
      const { id, column } = val;

      let update = [];
      
      Object.keys(fields).map(key => {
        const line = `${key} = '${fields[key]}'`;
        update.push(line);
      });

      const sql = `UPDATE ${this.table} SET ${update.join(',')} WHERE ${column} = ${id}`;

      return await db.query(sql);

    } catch (error) {
      console.log(`Unexpected error in DB UPDATE: ${error}`);
    }
  }

  async delete(val) {
    try {
      const { id, column } = val;

      let sql = `DELETE FROM ${this.table} WHERE ${column} = ${id}`;

      return await db.query(sql);

    } catch (error) {
      console.log(`Unexpected error in DB DELETE: ${error}`);
    }
  }
}