import { User } from './user';

class Admin extends User {

  constructor(name, email, password, userType){
    super(name, email, password, userType);
  }

  static fromJSON(json){
    return JSON.parse(json);
  }

  toJson(){
    return {
      ...super.toJson()
    };
  }

  static toString() {
    return `Admin [ID: ${this.id}, 
            Name: ${this.name}, 
            Username: ${this.username}, 
            Type: ${this.userType}]`;
  }

}