import { User } from './user';

export class Admin extends User {

  constructor(obj){
    super({...obj, userType: "admin"});
  }

  // From JSON
  static fromJSON(json){
    return JSON.parse(json);
  }

  // TO JSON
  toJson(){
    return {
      ...super.toJson()
    };
  }

  // TO STRING
  toString() {
    return `${super.toString()}`;
  }

}