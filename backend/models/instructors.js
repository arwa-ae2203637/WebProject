const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "../data/instructors.json");

class InstructorModel {
  constructor(id, name, expertise) {
    this.id = id;
    this.name = name;
    this.expertise = expertise;
  }

  // Load all instructors from JSON file
  static getAllInstructors() {
    try {
      if (!fs.existsSync(DATA_FILE)) return [];
      const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
      return data.data || [];
    } catch (error) {
      console.error("Error reading instructors data:", error.message);
      return [];
    }
  }

  // Get an instructor by ID
  static getInstructorById(id) {
    return (
      this.getAllInstructors().find((instructor) => instructor.id === id) ||
      null
    );
  }
}

module.exports = InstructorModel;
