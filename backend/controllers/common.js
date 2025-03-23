const ClassModel = require("../models/classes");
const CourseModel = require("../models/courses");
const InstructorModel = require("../models/instructors");

// ✅ Get ALL Courses with Classes & Instructors
const getAllDetails = async (req, res) => {
  try {
    // ✅ Step 1: Get All Courses
    const courses = CourseModel.getAllCourses();
    if (!courses || courses.length === 0) {
      return res.status(404).json({ message: "No courses found" });
    }

    // ✅ Step 2: Get All Classes & Instructors (Manual Filtering)
    const allClasses = ClassModel.getAllClasses(); // Fetch all classes at once

    const updatedCourses = courses.map((course) => {
      // 🔹 Filter classes that belong to the current course
      const relatedClasses = allClasses.filter(
        (classItem) => classItem.courseId === course.id
      );

      // 🔹 Get instructor details for each class
      const updatedClasses = relatedClasses.map((classItem) => {
        const instructor = InstructorModel.getInstructorById(
          classItem.instructorId
        );
        return {
          ...classItem,
          instructorDetails: instructor || null, // Attach instructor details
        };
      });

      return {
        ...course,
        classes: updatedClasses,
      };
    });

    // ✅ Step 3: Return Response
    res.status(200).json({ courses: updatedCourses });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching courses", error: error.message });
  }
};

module.exports = { getAllDetails };
