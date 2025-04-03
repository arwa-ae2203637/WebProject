import { customAlphabet } from 'nanoid';

export class User{
  #id;
  #name;
  #email;
  #password;
  #userType;

  constructor(obj){
    if(this.constructor === User){
      throw new Error("Can't instantiate abstract class");
    }
    this.#id = User.generateId(this.#userType);
    this.#name = obj?.name ?? "";
    this.#email = obj?.email ?? "";
    this.#password = obj?.password ?? "";
    this.#userType = obj?.userType ?? "";
  }

  // SETTERS AND GETTERS
  get id(){
    return this.#id;
  }
  get name(){
    return this.#name;
  }
  get email(){
    return this.#email;
  }
  get password(){
    return this.#password;
  }
  get userType(){
    return this.#userType;
  }
  set name(name){
    this.#name = name;
  }
  set email(email){
    this.#email = email;
  }
  set password(password){
    this.#password = password;
  }
  set userType(userType){
    this.#userType = userType;
  }

  // GENERATE USER ID
  static generateId(userType) {
    const numId = customAlphabet('0123456789', 8);
    if (userType === 'admin') return `ADMIN-${numId()}`;
    else if (userType === 'student') return `STUD-${numId()}`;
    else return `INST-${numId()}`;
  }


  toJson(){
    return {
      id: this.#id,
      name: this.#name,
      email: this.#email,
      password: this.#password,
      userType: this.#userType
    };
  }

  toString() {
    return `UserType: ${this.#userType}
            ID: ${this.#id}, 
            Name: ${this.#name}, 
            Email: ${this.#email},`;
  }
  
}