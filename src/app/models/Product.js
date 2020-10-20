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
  edit() { },
  remove() { }
}