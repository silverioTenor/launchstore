import db from '../../database/config';
import Base from './Base';

export default class Product extends Base {

  constructor() {
    super();
    this.table = "products";
  }

  static async getAllOfUsers(id) {
    try {
      const results = await db.query("SELECT * FROM products WHERE user_id = $1", [id]);
      return results.rows;

    } catch (error) {
      console.error(`Unexpected error in getAllOfUsers: ${error}`);
    }
  }

  static async search(params) {
    try {
      const { filter, brand } = params;

      let sql = "SELECT * FROM products ",
        filterQuery = "WHERE ";

      if (filter && brand) {
        filterQuery += `
          products.model ILIKE '%${filter}%' AND
          products.brand ILIKE '%${brand}%'
        `;
        sql += `${filterQuery}`;

      } else if (filter && !brand) {
        filterQuery += `products.model ILIKE '%${filter}%'`;
        sql += `${filterQuery}`;

      } else if (brand && !filter) {
        filterQuery += `products.brand ILIKE '%${brand}%'`;

        sql += `${filterQuery}`;
      }

      const results = await db.query(sql);
      return results.rows;

    } catch (error) {
      console.log(`Unexpected error in SEARCH: ${error}`);
    }
  }

  async getInOrder({ id, column }) {
    try {
      let sql = `SELECT * FROM ${this.table} WHERE ${column} = ${id} ORDER BY updated_at DESC`;

      const results = await db.query(sql);
      return results.rows;

    } catch (error) {
      console.log(`Unexpected error in DB GET: ${error}`);
    }
  }

  async getByProductsWithDeleted(filters) {
    try {
      let sql = `SELECT * FROM ${this.table}_with_deleted`;

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
}