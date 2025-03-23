const ClassModel = require("../models/classes");
const CourseModel = require("../models/courses");
const InstructorModel = require("../models/instructors");
const StudentModel = require("../models/users");
const GradesModel = require("../models/grades");

// Function to get all instructors
const getInstructorCourses = (req, res) => {
  const { instructorId } = req.params;

  try {
    console.log("Received request for instructorId:", instructorId);

    // Step 1: Load data from models
    const courses = CourseModel.getAllCourses();
    const classes = ClassModel.getAllClasses();
    const students = StudentModel.getAllStudents();
    const grades = GradesModel.getAllGrades(); // New step to get student-class relationships

    console.log("Courses loaded:", courses.length);
    console.log("Classes loaded:", classes.length);
    console.log("Students loaded:", students.length);
    console.log("Grades loaded:", grades.length); // Debugging log for grades

    // Step 2: Filter "In Progress" courses
    const inProgressCourses = courses.filter(
      (course) => course.status === "in-progress"
    );
    console.log("Filtered In-Progress Courses:", inProgressCourses.length);

    // Step 3: Get only "started" classes for this instructor
    const instructorCourses = inProgressCourses.map((course) => {
      const courseClasses = classes.filter(
        (cls) =>
          cls.courseId == course.id &&
          cls.instructorId == instructorId &&
          cls.status == "started" // Only validated (started) classes
      );

      console.log(
        `Course ${course.id} - Valid Classes Found:`,
        courseClasses.length
      );

      return {
        ...course,
        classes: courseClasses.map((cls) => {
          // Step 4: Find students using GradesModel
          const enrolledStudents = grades
            .filter((grade) => grade.classId === cls.id)
            .map((grade) => {
              const student = students.find((s) => s.id === grade.studentId);
              return student ? { ...student, grade: grade.grade } : null;
            })
            .filter((s) => s !== null); // Remove null values

          console.log(
            `Class ${cls.id} - Enrolled Students Found:`,
            enrolledStudents.length
          );

          return {
            ...cls,
            students: enrolledStudents,
          };
        }),
      };
    });

    // Step 5: Remove courses that have no valid classes
    const filteredCourses = instructorCourses.filter(
      (course) => course.classes.length > 0
    );
    console.log("Final Filtered Courses:", filteredCourses.length);

    res.status(200).json({ success: true, data: filteredCourses });
  } catch (error) {
    console.error("Error fetching instructor courses:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getAllInstructors = (req, res) => {
  try {
    const instructors = InstructorModel.getAllInstructors();
    res.status(200).json({ success: true, data: instructors });
  } catch (error) {
    console.error("Error fetching instructors:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Function to get instructor by ID
const getInstructorById = (req, res) => {
  try {
    const { id } = req.params;
    const instructor = InstructorModel.getInstructorById(id);

    if (!instructor) {
      return res
        .status(404)
        .json({ success: false, message: "Instructor not found" });
    }

    res.status(200).json({ success: true, data: instructor });
  } catch (error) {
    console.error("Error fetching instructor by ID:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { getAllInstructors, getInstructorById, getInstructorCourses };
