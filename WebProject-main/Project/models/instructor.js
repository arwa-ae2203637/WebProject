import {User} from 'models/user.js';

class Instructor extends User{
  expertise_area;
  assigned_classes;

  constructor(name, email, password, userType, expertise_area, assigned_classes){
    super(name, email, password, userType);
    this.expertise_area = expertise_area;
    this.assigned_classes = assigned_classes;
  }

  static fromJSON(json){
    return JSON.parse(json);
  }

  toJson(){
    return {
      ...super.toJson(),
      expertise_area: this.expertise_area,
      assigned_classes: this.assigned_classes
    };
  }

  static toString() {
    return `Instructor [ID: ${this.id}, 
            Name: ${this.name}, 
            Username: ${this.username}, 
            Type: ${this.userType},
            Expertise Area: ${this.expertise_area},
            Assigned Classes: ${this.assigned_classes}]`;
  }

}