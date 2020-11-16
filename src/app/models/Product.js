import db from '../../database/config';

export default class Product{
  static get(id) {
    return db.query("SELECT * FROM products WHERE id = $1", [id]);
  }

  static getAll() {
    return db.query("SELECT id, brand, model, storage, color, price FROM products");
  }

  static async save(values) {
    try {
      const sql = `
      INSERT INTO products (
        user_id,
        color,
        brand,
        model,
        condition,
        description,
        price,
        old_price,
        storage
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id;
    `;

      const results = await db.query(sql, values);
      return results.rows[0].id;

    } catch (error) {
      console.error(`Unexpected error in SAVE: ${error}`);
    }
  }

  static edit(values) {
    try {
      const sql = `
      UPDATE products SET
        color = $2,
        brand = $3,
        model = $4,
        condition = $5,
        description = $6,
        price = $7,
        old_price = $8,
        storage = $9
      WHERE id = $1
    `;

      return db.query(sql, values);
    } catch (error) {
      console.error(`Unexpected error in UPDATE: ${error}`);
    }
  }

  static remove(id) {
    try {
      return db.query("DELETE FROM products WHERE id = $1", [id]);
    } catch (error) {
      console.error(`Unexpected error in REMOVE: ${error}`);
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