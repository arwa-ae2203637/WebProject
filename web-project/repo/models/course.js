
export class Course{
  #id;
  #name;
  #credit_hours;
  #category;
  #prerequisites;
  #campus; 
  #status;

  constructor(obj){
    this.#id = obj?.id;
    this.#name = obj?.name ?? "";
    this.#credit_hours = obj?.credit_hours ?? 0;
    this.#category = obj?.category ?? "";
    this.#prerequisites = obj?.prerequisites ?? [];
    this.#campus = obj?.campus ?? "";
    this.#status = obj?.status ?? "";
  }

  get id(){
    return this.#id;
  }

  get name(){
    return this.#name;
  }

  get credit_hours(){
    return this.#credit_hours;
  }

  get category(){
    return this.#category;
  }
  
  get prerequisites(){
    return this.#prerequisites;
  }

  get campus(){
    return this.#campus;
  }

  get status(){
    return this.#status;
  }

  set id(value){
    this.#id = value;
  }

  set name(value){

    this.#name = value;

  }

  set credit_hours(value){
    this.#credit_hours = value;
  }

  set category(value){
    this.#category = value;
  }

  set prerequisites(value){
    this.#prerequisites = value;
  }

  set campus(value){
    this.#campus = value;
  }

  set status(value){
    this.#status = value;
  }

  static fromJSON(json){
    const object = typeof json === "string" ? JSON.parse(json) : json; 
    return new Course(object);
  }

  toJSON(){
    return {
      id: this.#id,
      name: this.#name,
      credit_hours: this.#credit_hours,
      category: this.#category,
      prerequisites: this.#prerequisites,
      campus: this.#campus,
      status: this.#status
    };
  }

  toString(){
    return `Course -
      ID: ${this.#id}, 
      Name: ${this.#name}, 
      Credit Hours: ${this.#credit_hours},
      Category: ${this.#category},
      Prerequisites: ${this.#prerequisites},
      Campus: ${this.#campus},`;
  }
}