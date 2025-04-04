export class Course{
    #id;
    #name;
    #credit_hours;
    #category;
    #description;
    #prerequisites;

    constructor(obj){
      this.#id = obj?.id ?? nanoid(10);
    }

    static fromJSON(json){
      return JSON.parse(json);
    }

    toJson(){
      return {
        id: this.#id,
        name: this.#name,
        credit_hours: this.#credit_hours,
        category: this.#category,
        description: this.#description,
        prerequisites: this.#prerequisites
      };
    }

    toString(){
      return `Course -
              ID: ${this.#id}, 
              Name: ${this.#name}, 
              Description: ${this.#description}, 
              Credit Hours: ${this.#credit_hours},
              Category: ${this.#category},
              Prerequisites: ${this.#prerequisites} `;
    }
}