import db from '../../database/config';

export default class FilesManager {

  static get(values) {
    const { id, column } = values;

    const sql = `
      SELECT files_manager.id, files.path FROM files_manager
      LEFT JOIN files ON (files_manager.id = files.files_manager_id)
      WHERE ${column} = $1;
    `;

    try {
      return db.query(sql, [id]);

    } catch (error) {
      console.log(`Unexpected error: ${error}`);
    }
  }

  static save(values) {
    const { id, column } = values;

    const sql = `INSERT INTO files_manager (${column}) VALUES ($1) RETURNING id;`;

    try {
      return db.query(sql, [id]);

    } catch (error) {
      console.log(`Unexpected error: ${error}`);
    }
  }

  static saveInFiles(values) {

    const sql = `INSERT INTO files (path, files_manager_id) VALUES ($1, $2)`;

    try {
      return db.query(sql, values);

    } catch (error) {
      console.log(`Unexpected error: ${error}`);
    }
  }

  static edit(values) {
    const sql = `
      UPDATE files SET path = $2 
      WHERE files.files_manager_id = $1
    `;

    try {
      return db.query(sql, values);

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