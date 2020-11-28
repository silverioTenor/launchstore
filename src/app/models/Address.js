// import db from '../../database/config';
import Base from './Base';

const base = new Base();
base.init({ table: 'Address' });

export default class Address extends Base { }