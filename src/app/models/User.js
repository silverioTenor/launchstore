import Base from './Base';

export default class User extends Base {
  
  constructor() {
    super();
    this.table = "users";
  }
}