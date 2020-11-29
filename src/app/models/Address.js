// import db from '../../database/config';
import Base from './Base';

Base.init({ table: 'Address' });

export default class Address extends Base { }