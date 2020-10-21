const db = require('../../database/config');

module.exports = {
  get(id) {
    return db.query("SELECT * FROM products WHERE id = $1", [id]);
  },
  getAll() {
    return db.query("SELECT id, brand, model, storage, color, price FROM products");
  },
  save(values) {
    try {
      const sql = `
      INSERT INTO products (
        color,
        brand,
        model,
        condition,
        description,
        price,
        old_price,
        storage
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id;
    `;

      return db.query(sql, values);
    } catch (error) {
      throw new Error(error);
    }
  },
  edit(values) {
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
      throw new Error(error);
    }
  },
  remove() { }
}