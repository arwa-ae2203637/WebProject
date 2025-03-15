export class Course{
    id;
    name;
    credit_hours;
    category;
    description;
    prerequisites;

    constructor(id, name, description, credit_hours, category, prerequisites){
        this.id = id;
        this.name = name;
        this.credit_hours = credit_hours;
        this.category = category; 
        this.description = description;
        this.prerequisites = prerequisites;
    }

    static fromJSON(json){
      return JSON.parse(json);
    }
}