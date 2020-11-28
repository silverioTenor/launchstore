// import db from '../../database/config';
import Base from './Base';

const base = new Base();
base.init({ table: 'File' });

export default class File extends Base { }