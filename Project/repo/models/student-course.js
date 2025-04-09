// StudentCourse.js
export class StudentCourse {
    #crn;
    #course_id;
    #status;
    #grade;

    constructor(obj) {
        this.#crn = obj?.crn ?? "";
        this.#course_id = obj?.course_id ?? "";
        this.#status = obj?.status ?? "pending"; 
        this.#grade = obj?.grade ?? "N/A"; 
    }

    // Getters and setters
    get crn() {
        return this.#crn;
      }
    
      set crn(value) {
        this.#crn = value;
      }
    
      get course_id() {
        return this.#course_id;
      }
    
      set course_id(value) {
        this.#course_id = value;
      }
    
      get status() {
        return this.#status;
      }
    
      set status(value) {
        this.#status = value;
      }
    
      get grade() {
        return this.#grade;
      }
    
      set grade(value) {
        this.#grade = value;
      }

    static fromJSON(json) {
      const object = typeof json === "string" ? JSON.parse(json) : json;
        return new StudentCourse(object);
    }
  
    toJSON() {
      return {
        crn: this.#crn,
        course_id: this.#course_id,
        status: this.#status,
        grade: this.#grade
      }
    }
    toString() {
        return `StudentCourse {crn: ${this.#crn}, course_id: ${this.#course_id}, status: ${this.#status}, grade: ${this.#grade || 'N/A'}}`;
      }
      
  }