// import db from '../../database/config';
import Base from './Base';

const base = new Base();
base.init({ table: 'User' });

export default class User extends Base { }