// import db from '../../database/config';
import Base from './Base';

Base.init({ table: 'User' });

export default class User extends Base { }