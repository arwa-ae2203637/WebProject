const GradesModel = require("../models/grades");
const ClassModel = require("../models/classes");
const submitStudentGrades = (req, res) => {
  try {
    const { courseId, classId, grades } = req.body; // Expecting { courseId: "cmps151", classId: "L51", grades: [{ studentId: "S101", grade: "A" }] }

    if (!courseId || !classId || !grades || !Array.isArray(grades)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid input data" });
    }

    console.log(
      "Received grades submission for course:",
      courseId,
      "and class:",
      classId
    );

    // Load existing classes and validate the course-class relationship
    const classes = ClassModel.getAllClasses();
    const validClass = classes.find(
      (cls) => cls.id === classId && cls.courseId === courseId
    );

    if (!validClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found for the given course",
      });
    }

    // Load existing grades
    let existingGrades = GradesModel.getAllGrades();

    grades.forEach(({ studentId, grade }) => {
      const gradeIndex = existingGrades.findIndex(
        (g) => g.classId === classId && g.studentId === studentId
      );

      if (gradeIndex !== -1) {
        // Update existing grade
        existingGrades[gradeIndex].grade = grade;
      } else {
        // Add new grade entry
        existingGrades.push({ studentId, classId, courseId, grade });
      }
    });

    // Save updated grades
    GradesModel.saveGrades(existingGrades);

    console.log(
      "Grades successfully updated for course:",
      courseId,
      "class:",
      classId
    );
    res
      .status(200)
      .json({ success: true, message: "Grades submitted successfully" });
  } catch (error) {
    console.error("Error submitting grades:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
module.exports = { submitStudentGrades };
