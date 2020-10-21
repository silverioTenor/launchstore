const db = require('../../database/config');

module.exports = {
  get(id) {
    return db.query("SELECT * FROM products WHERE id = $1", [id]);
  },
  getAll() {
    return db.query("SELECT * FROM products");
  },
  save(values) {
    try {
      const sql = `
      INSERT INTO products (
        color,
        brand,
        model,
        status,
        description,
        price,
        old_price,
        storage,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
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
        status = $5,
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