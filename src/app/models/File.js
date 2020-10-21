const db = require('../../database/config');

module.exports = {
  get(id) {
    return db.query("SELECT path, product_id FROM files WHERE product_id = $1", [id]);
  },
  save(values) {
    try {
      const sql = `INSERT INTO files (path, product_id) VALUES ($1, $2);`;

      return db.query(sql, values);
    } catch (error) {
      throw new Error(error);
    }
  },
  edit(values) {
    try {
      const sql = `UPDATE files SET path =  $2 WHERE product_id = $1;`;

      return db.query(sql, values);
    } catch (error) {
      throw new Error(error);
    }
  },
  remove() { }
}