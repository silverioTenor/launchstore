import Base from './Base.js';

export default class User extends Base {
  
  constructor() {
    super();
    this.table = "users";
  }
}