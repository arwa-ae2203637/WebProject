const fs = require("fs");
const path = require("path");

// Path to the JSON file
const DATA_FILE = path.join(__dirname, "../data/courses.json");

class CourseModel {
  constructor(id, name, creditHours, category, prerequisites, status) {
    this.id = id;
    this.name = name;
    this.creditHours = creditHours;
    this.category = category;
    this.prerequisites = prerequisites;
    this.status = status;
  }

  // Load all courses from JSON file
  static getAllCourses() {
    try {
      if (!fs.existsSync(DATA_FILE)) return [];
      const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
      return data.data || [];
    } catch (error) {
      console.error("Error reading courses data:", error.message);
      return [];
    }
  }

  // Save courses back to JSON file
  static saveCourses(courses) {
    try {
      fs.writeFileSync(
        DATA_FILE,
        JSON.stringify({ data: courses }, null, 2),
        "utf8"
      );
      return true;
    } catch (error) {
      console.error("Error saving courses data:", error.message);
      return false;
    }
  }

  // Get a course by ID
  static getCourseById(id) {
    return this.getAllCourses().find((course) => course.id === id) || null;
  }

  // Add a new course
  static addCourse(newCourse) {
    const courses = this.getAllCourses();

    // Ensure ID is unique
    if (courses.some((course) => course.id === newCourse.id)) {
      console.error(`Course with ID ${newCourse.id} already exists.`);
      return false;
    }

    courses.push(newCourse);
    this.saveCourses(courses);
    return newCourse;
  }

  // Update an existing course
  static updateCourse(id, updatedData) {
    const courses = this.getAllCourses();
    const index = courses.findIndex((course) => course.id === id);
    if (index === -1) return null;

    courses[index] = { ...courses[index], ...updatedData };
    this.saveCourses(courses);
    return courses[index];
  }

  // Delete a course
  static deleteCourse(id) {
    const courses = this.getAllCourses();
    const filteredCourses = courses.filter((course) => course.id !== id);

    if (courses.length === filteredCourses.length) return false; // No course found

    this.saveCourses(filteredCourses);
    return true;
  }
}

module.exports = CourseModel;
