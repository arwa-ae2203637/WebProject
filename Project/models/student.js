import { User } from "models/user.js";

export class Student extends User{
  #completedCourses = [];
  #currentCourses = [];
  #pendingCourses = [];

  constructor(obj){
    super({...obj, userType: "student"});
    this.#completedCourses = obj?.completedCourses ?? [];
    this.#currentCourses = obj?.currentCourses ?? [];
    this.#pendingCourses = obj?.pendingCourses ?? [];
  }

  // SETTERS AND GETTERS
  get completedCourses(){
    return this.#completedCourses;
  }
  get currentCourses(){
    return this.#currentCourses;
  }
  get pendingCourses(){
    return this.#pendingCourses;
  }
  set completedCourses(completedCourses){
    this.#completedCourses = completedCourses;
  }
  set currentCourses(currentCourses){
    this.#currentCourses = currentCourses;
  }
  set pendingCourses(pendingCourses){
    this.#pendingCourses = pendingCourses;
  }

  // FROM JSON
  static fromJSON(json){
    return JSON.parse(json);
  }

  // TO JSON
  toJson(){
    return {
      ...super.toJson(),
      completedCourses: this.#completedCourses,
      currentCourses: this.#currentCourses,
      pendingCourses: this.#pendingCourses,
    };
  }

  // TO STRING
  toString() {
    return `${super.toString()}, 
            Completed Courses: ${this.#completedCourses.length}, 
            Current Courses: ${this.#currentCourses.length}, 
            Pending Courses: ${this.#pendingCourses.length},`;
  }
  
}