import { customAlphabet } from 'nanoid';

export class User{
  id;
  name;
  email;
  password;
  userType;

  constructor(name, email, password, userType){
    this.id = generateUserId();
    this.name = name;
    this.email = email;
    this.password = password;
    this.userType = userType;
  }

  static generateId() {
    const numId = customAlphabet('0123456789', 9);
    if(this.userType === 'admin') return `ADMIN-${numId()}`;
    else if(this.userType === 'student') return `STUD-${numId()}`;
    else return `INST-${numId()}`;
  };

  static fromJSON(json){
    return JSON.parse(json);
  }

  toJson(){
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
      userType: this.userType
    };
  }

  static toString() {
    return `User [ID: ${this.id}, 
            Name: ${this.name}, 
            Username: ${this.username}, 
            Type: ${this.userType}]`;
  }
  
}