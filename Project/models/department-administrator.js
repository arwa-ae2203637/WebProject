import { User } from './user.js';

export class Admin extends User {

  constructor(obj){
    super({...obj});
  }

  // From JSON
  static fromJSON(json){
    const object = typeof json === "string" ? JSON.parse(json) : json; 
    return new Admin(object);
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