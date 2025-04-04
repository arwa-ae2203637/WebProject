import { Course } from "models/course.js";

export class Class extends Course{
    #crn;
    #instructor;
    #class_limit;
    #scheduale
    #students;

    constructor(obj){ 
        super(obj);
        this.crn = obj.crn;
        this.instructor = obj?.instructor ?? "";
        this.class_limit = obj?.class_limit ?? 0;
        this.scheduale = obj?.scheduale ?? [];
        this.students = obj?.students ?? [];
    }

    // SETTERS AND GETTERS
    get crn(){
      return this.#crn;
    }
    set crn(crn){
      this.#crn = crn;
    }
    get instructor(){
      return this.#instructor;
    }
    set instructor(instructor){
      this.#instructor = instructor;
    }
    get class_limit(){
      return this.#class_limit;
    }
    set class_limit(class_limit){
      this.#class_limit = class_limit;
    }
    get scheduale(){
      return this.#scheduale;
    }
    set scheduale(scheduale){
      this.#scheduale = scheduale;
    }
    get students(){
      return this.#students;
    }
    set students(students){
      this.#students = students;
    }
    static fromJSON(json){
      return JSON.parse(json);
    }

    // TOJSON METHOD
    toJson(){
      return {
        ...super.toJson(),
        crn: this.crn,
        instructor: this.instructor,
        class_limit: this.class_limit,
        scheduale: this.scheduale,
        students: this.students
      };
    }

    // FROM

    // TOSTRING METHOD
    toString() {
      return `${super.toString()}
              Class -
              CRN: ${this.crn}, 
              Instructor: ${this.instructor}, 
              Class Limit: ${this.class_limit},
              Schedule: ${this.scheduale},
              Students: ${this.students},`;
    }
}