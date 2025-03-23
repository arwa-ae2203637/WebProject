const fs = require("fs");
const path = require("path");

// Path to the JSON file
const DATA_FILE = path.join(__dirname, "../data/classes.json");

class ClassModel {
  constructor(
    id,
    courseId,
    instructorId,
    crn,
    classLimit,
    enrolled,
    schedule,
    status
  ) {
    this.id = id;
    this.courseId = courseId;
    this.instructorId = instructorId;
    this.crn = crn;
    this.classLimit = classLimit;
    this.enrolled = enrolled;
    this.schedule = schedule;
    this.status = status;
  }

  // Load all classes from the JSON file
  static loadClasses() {
    try {
      if (!fs.existsSync(DATA_FILE)) {
        return [];
      }
      const data = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(data).data || [];
    } catch (error) {
      console.error("Error reading classes data:", error.message);
      return []; // ✅ Fix: Handle JSON parsing errors
    }
  }

  // Save classes to the JSON file
  static saveClasses(classes) {
    try {
      const jsonData = { data: classes };
      fs.writeFileSync(DATA_FILE, JSON.stringify(jsonData, null, 2), "utf-8");
      return true;
    } catch (error) {
      console.error("Error saving classes data:", error.message);
      return false;
    }
  }

  // Get all classes
  static getAllClasses() {
    return this.loadClasses();
  }

  // Get a class by ID
  static getClassById(classId) {
    return this.loadClasses().find((cls) => cls.id === classId) || null; // ✅ Fix: Return null if not found
  }

  // Add a new class
  static addClass(newClass) {
    const classes = this.loadClasses();

    // Ensure ID is unique
    if (classes.some((cls) => cls.id === newClass.id)) {
      console.error(`Class with ID ${newClass.id} already exists.`);
      return false; // ✅ Fix: Prevent duplicate IDs
    }

    classes.push(newClass);
    this.saveClasses(classes);
    return true;
  }

  // Update an existing class
  static updateClass(classId, updatedData) {
    const classes = this.loadClasses();
    const index = classes.findIndex((cls) => cls.id === classId);
    if (index !== -1) {
      classes[index] = { ...classes[index], ...updatedData };
      this.saveClasses(classes);
      return true;
    }
    return false;
  }

  // Delete a class by ID
  static deleteClass(classId) {
    let classes = this.loadClasses();
    const newClasses = classes.filter((cls) => cls.id !== classId);
    if (classes.length !== newClasses.length) {
      this.saveClasses(newClasses);
      return true;
    }
    return false;
  }
}

module.exports = ClassModel;
