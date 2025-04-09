import {User} from './user.js';

export class Instructor extends User{
  #expertise_area;
  #assigned_classes;

  constructor(obj){
    super({...obj});
    this.#expertise_area = obj?.expertise_area ?? [];
    this.#assigned_classes = obj?.assigned_classes ?? [];
  }

  // SETTERS AND GETTERS
  get expertise_area(){
    return this.#expertise_area;
  }
  get assigned_classes(){
    return this.#assigned_classes;
  }
  set expertise_area(expertise_area){
    this.#expertise_area = expertise_area;
  }
  set assigned_classes(assigned_classes){
    this.#assigned_classes = assigned_classes;
  }

  // FROM JSON
  static fromJSON(json){
    const object = typeof json === "string" ? JSON.parse(json) : json; 
    return new Instructor(object);
  }

  // TO JSON
  toJSON(){
    return {
      ...super.toJSON(),
      expertise_area: this.#expertise_area,
      assigned_classes: this.#assigned_classes
    };
  }

  // TO STRING
  toString() {
    return `${super.toString()}, 
            Expertise Area: ${this.#expertise_area},
            Assigned Classes: ${this.#assigned_classes},`;
  }

}