import { Course } from "models/course.js";

class Class extends Course{
    crn;
    instructor;
    class_limit;
    scheduale
    students;

    constructor(id, name, description, credit_hours, category, prerequisites, crn, instructor, class_limit, scheduale, students){ 
        super(id, name, description, credit_hours, category, prerequisites);
        this.crn = crn;
        this.instructor = instructor;
        this.class_limit = class_limit;
        this.scheduale = scheduale;
        this.students = students;
    }

    static fromJSON(json){
      return JSON.parse(json);
    }

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

    static toString() {
      return `Class [ID: ${this.id}, 
              Name: ${this.name}, 
              Description: ${this.description}, 
              Credit Hours: ${this.credit_hours},
              Category: ${this.category},
              Prerequisites: ${this.prerequisites},
              CRN: ${this.crn},
              Instructor: ${this.instructor},
              Class Limit: ${this.class_limit},
              Schedule: ${this.scheduale},
              Students: ${this.students}]`;
    }
}