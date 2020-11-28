import db from '../../database/config';
import Base from './Base';

const base = new Base();
base.init({ table: 'Product' });

export default class Product extends Base {

  static async getAllOfUsers(id) {
    try {
      const results = await db.query("SELECT * FROM products WHERE user_id = $1", [id]);
      return results.rows;

    } catch (error) {
      console.error(`Unexpected error in getAllOfUsers: ${error}`);
    }
  }

  static search(params) {
    const { filter, brand } = params;

    let sql = "",
      filterQuery = "WHERE";

    if (brand) {
      filterQuery = `
          ${filterQuery}
          products.brand ILIKE '%${brand}%'
          OR
        `;
    }

    filterQuery = `
        ${filterQuery}
        products.model ILIKE '%${filter}%'
      `;

    sql = `SELECT * FROM products ${filterQuery}`;

    try {
      return db.query(sql);

    } catch (error) {
      console.error(error);
    }
  }
}