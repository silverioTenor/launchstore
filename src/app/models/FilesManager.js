import db from '../../database/config';
import Base from './Base';

const base = new Base();
base.init({ table: 'FilesManager' });

export default class FilesManager extends Base {

  static async getFiles(values) {
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
}