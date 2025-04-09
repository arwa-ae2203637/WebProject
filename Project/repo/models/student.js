import { User } from "./user.js";
import { StudentCourse } from "./student-course.js";

export class Student extends User{
  #courses;

  constructor(obj){
    super({...obj});
    this.#courses = obj?.courses ?? [];
  }

  // SETTERS AND GETTERS
  get courses(){
    return this.#courses;
  }
  set courses(courses){
    this.#courses = courses;
  }

  addCourse(obj){
    const course = new StudentCourse(obj);
    this.#courses.push(course);
    return course;
  }

  // FROM JSON
  static fromJSON(json){
    const object = typeof json === "string" ? JSON.parse(json) : json; 
    return new Student(object);
  }

  // TO JSON
  toJSON(){
    return {
      ...super.toJSON(),
      courses: this.#courses
    };
  }

  // TO STRING
  toString() {
    return `${super.toString()}, 
            courses: ${this.#courses.map(course => course.toString())}`;
  }
  
}