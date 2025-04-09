import { Course } from "./course.js";

export class Class extends Course{
    #crn;
    #course_id
    #instructor;
    #class_limit;
    #schedule
    #students;

    constructor(obj){ 
        super({...obj});
        this.crn = obj.crn;
        this.course_id = obj?.course_id ?? "";
        this.instructor = obj?.instructor ?? "";
        this.class_limit = obj?.class_limit ?? 0;
        this.schedule = obj?.schedule ?? [];
        this.students = obj?.students ?? [];
    }

    // SETTERS AND GETTERS
    get crn(){
      return this.#crn;
    }
    set crn(crn){
      this.#crn = crn;
    }
    get course_id(){
      return this.#course_id;
    }
    set course_id(course_id){
      this.#course_id = course_id;
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
    get schedule(){
      return this.#schedule;
    }
    set schedule(schedule){
      this.#schedule = schedule;
    }
    get students(){
      return this.#students;
    }
    set students(students){
      this.#students = students;
    }

    static fromJSON(json){
      const object = typeof json === "string" ? JSON.parse(json) : json; 
      return new Class(object);
    }

    // TOJSON METHOD
    toJSON(){
      return {
        ...super.toJSON(),
        crn: this.#crn,
        course_id: this.#course_id,
        instructor: this.#instructor,
        class_limit: this.#class_limit,
        schedule: this.#schedule,
        students: this.#students
      };
    }


    // TOSTRING METHOD
    toString() {
      return `${super.toString()}
              Class -
              CRN: ${this.crn}, 
              Course ID: ${this.course_id},
              Instructor: ${this.instructor}, 
              Class Limit: ${this.class_limit},
              Schedule: ${this.schedule},
              Students: ${this.students},`;
    }
}