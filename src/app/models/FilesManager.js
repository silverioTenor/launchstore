import db from '../../database/config';

export default class FilesManager {

  static async get(values) {
    try {
      const { id, column } = values;

      const sql = `
        SELECT files_manager.id, files.path FROM files_manager
        LEFT JOIN files ON (files_manager.id = files.files_manager_id)
        WHERE ${column} = $1;
      `;

      const results = await db.query(sql, [id]);
      return results.rows[0];

    } catch (error) {
      console.log(`Unexpected error: ${error}`);
    }
  }

  static async save(values) {
    try {
      const { id, column } = values;

      const sql = `INSERT INTO files_manager (${column}) VALUES ($1) RETURNING id;`;

      const results = await db.query(sql, [id]);
      return results.rows[0].id;

    } catch (error) {
      console.log(`Unexpected error: ${error}`);
    }
  }

  static async saveInFiles(values) {

    try {
      const sql = `INSERT INTO files (path, files_manager_id) VALUES ($1, $2)`;

      await db.query(sql, values);
      return

    } catch (error) {
      console.log(`Unexpected error: ${error}`);
    }
  }

  static async edit(values) {
    try {
      const sql = `
        UPDATE files SET path = $2 
        WHERE files.files_manager_id = $1
      `;

      await db.query(sql, values);
      return

    } catch (error) {
      console.log(`Unexpected error: ${error}`);
    }
  }

  static remove(values) {
    const { id, column } = values;

    try {
      return db.query(`DELETE FROM files_manager WHERE ${column} = $1`, [id]);

    } catch (error) {
      console.log(`Unexpected error: ${error}`);
    }
  }

  static removeInFiles(id) {
    const sql = `
      DELETE FROM files
      WHERE files.files_manager_id = $1
    `;

    try {
      return db.query(sql, [id]);

    } catch (error) {
      console.log(`Unexpected error: ${error}`);
    }
  }
}