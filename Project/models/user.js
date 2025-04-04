import { customAlphabet } from "https://cdn.skypack.dev/nanoid";

export class User{
  #id;
  #firstName;
  #lastName;
  #username;
  #password;
  #userType;

  constructor(obj){
    // if(this.constructor === User){
    //   throw new Error("Can't instantiate abstract class");
    // }
    this.#id = obj.id ?? User.generateId(this.#userType);
    this.#firstName = obj?.firstName ?? "";
    this.#lastName = obj?.lastName ?? "";
    this.#username = obj?.username ?? "";
    this.#password = obj?.password ?? "";
    this.#userType = obj?.userType ?? "";
  }

  // SETTERS AND GETTERS
  get id(){
    return this.#id;
  }
  get firstName(){
    return this.#firstName;
  }
  get lastName(){
    return this.#lastName;
  }
  get username(){
    return this.#username;
  }
  get password(){
    return this.#password;
  }
  get userType(){
    return this.#userType;
  }
  set firstName(firstName){
    this.#firstName = firstName;
  }
  set lastName(lastName){
    this.#lastName = lastName;
  }
  set username(username){
    this.#username = username;
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
  };


  static fromJSON(json){
    const object = typeof json === "string" ? JSON.parse(json) : json; 
    return new User(object);
  }


  toJson(){
    return {
      id: this.#id,
      firstName: this.#firstName,
      lastName: this.#lastName,
      username: this.#username,
      password: this.#password,
      userType: this.#userType
    };
  }

  toString() {
    return `UserType: ${this.#userType}
            ID: ${this.#id}, 
            FirstName: ${this.#firstName}, 
            LastName: ${this.#lastName},
            username: ${this.#username},`;
  }
  
}