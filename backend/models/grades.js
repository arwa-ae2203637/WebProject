const fs = require("fs");
const path = require("path");

// Path to the JSON file
const DATA_FILE = path.join(__dirname, "../data/grades.json");

class GradeModel {
  constructor(studentId, classId, grade) {
    this.studentId = studentId;
    this.classId = classId;
    this.grade = grade;
  }

  static loadGrades() {
    try {
      if (!fs.existsSync(DATA_FILE)) {
        return [];
      }
      const data = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(data) || [];
    } catch (error) {
      console.error("Error reading grades data:", error.message);
      return [];
    }
  }

  static saveGrades(grades) {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(grades, null, 2), "utf-8");
      return true;
    } catch (error) {
      console.error("Error saving grades data:", error.message);
      return false;
    }
  }

  static getAllGrades() {
    return this.loadGrades();
  }

  static addGrade(newGrade) {
    const grades = this.loadGrades();
    if (
      grades.some(
        (grade) =>
          grade.studentId === newGrade.studentId &&
          grade.classId === newGrade.classId
      )
    ) {
      console.error(
        `Grade already exists for Student ${newGrade.studentId} in Class ${newGrade.classId}.`
      );
      return false;
    }

    grades.push(newGrade);
    this.saveGrades(grades);
    return true;
  }

  // Update an existing grade
  static updateGrade(studentId, classId, updatedGrade) {
    const grades = this.loadGrades();
    const index = grades.findIndex(
      (grade) => grade.studentId === studentId && grade.classId === classId
    );
    if (index !== -1) {
      grades[index].grade = updatedGrade;
      this.saveGrades(grades);
      return true;
    }
    return false;
  }
}

module.exports = GradeModel;
