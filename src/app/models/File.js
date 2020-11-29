// import db from '../../database/config';
import Base from './Base';

Base.init({ table: 'File' });

export default class File extends Base { }