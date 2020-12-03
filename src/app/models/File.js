import db from '../../database/config';
import Base from './Base';

export default class File extends Base {

  constructor() {
    super();
    this.table = "files";
  }

  async create(values) {
    try {
      const sql = `INSERT INTO ${this.table} (path, files_manager_id) VALUES ($1, $2)`;

      return await db.query(sql, values);

    } catch (error) {
      console.log(`Unexpected error in DB CREATE: ${error}`);
    }
  }

  async update(values) {
    try {
      const sql = `UPDATE files SET path = $2 WHERE files_manager_id = $1`;

      return await db.query(sql, values);
    } catch (error) {
      console.error(`Unexpected error in UPDATE FILES: ${error}`);
    }
  }
}