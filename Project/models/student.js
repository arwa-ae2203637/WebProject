import { User } from "models/user.js";

class Student extends User{
  completedCourses = [];
  currentCourses = [];
  pendingCourses = [];

  constructor(name, email, password, userType, completedCourses, currentCourses, pendingCourses){
    super(name, email, password, userType);
    this.completedCourses = completedCourses;
    this.currentCourses = currentCourses;
    this.pendingCourses = pendingCourses;
  }

  static fromJSON(json){
    return JSON.parse(json);
  }

  toJson(){
    return {
      ...super.toJson(),
      completedCourses: this.completedCourses,
      currentCourses: this.currentCourses,
      pendingCourses: this.pendingCourses
    };
  }

  static toString() {
    return `Student [ID: ${this.id}, 
            Name: ${this.name}, 
            Username: ${this.username}, 
            Type: ${this.userType},
            Completed Courses: ${this.completedCourses},
            Current Courses: ${this.currentCourses},
            Pending Courses: ${this.pendingCourses}]`;
  }

}