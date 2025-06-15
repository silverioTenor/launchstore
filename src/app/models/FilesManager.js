import db from '../../database/config.js';
import Base from './Base.js';

export default class FilesManager extends Base {

  constructor() {
    super();
    this.table = "files_manager";
  }

  async getFiles({ id, column }) {
    try {
      const sql = `
        SELECT files_manager.id, files.path FROM files_manager
        LEFT JOIN files ON (files_manager.id = files.files_manager_id)
        WHERE ${column} = ${id};
      `;

      const results = await db.query(sql);
      return results.rows[0];

    } catch (error) {
      console.log(`Unexpected error: ${error}`);
    }
  }
}