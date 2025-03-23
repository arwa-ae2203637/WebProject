const ClassModel = require("../models/classes");
const CourseModel = require("../models/courses");
const InstructorModel = require("../models/instructors");
const { v4: uuidv4 } = require("uuid");
// ✅ 1. Get all classes
const getAllClasses = (req, res) => {
  try {
    const classes = ClassModel.getAllClasses();
    res.status(200).json(classes);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving classes", error: error.message });
  }
};

// ✅ 2. Validate a class (Admin action)
const validateClass = (req, res) => {
  try {
    const { id } = req.params;
    const classData = ClassModel.getClassById(id);

    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    // ✅ Update class status to "started"
    ClassModel.updateClass(id, { status: "started" });

    // ✅ Fetch the related course
    const course = CourseModel.getCourseById(classData.courseId);
    if (!course) {
      return res.status(404).json({ message: "Related course not found" });
    }

    // ✅ If course is "pending", update it to "in-progress"
    if (course.status === "pending") {
      CourseModel.updateCourse(course.id, { status: "in-progress" });
    }

    res.status(200).json({
      message: "Class validated successfully",
      classData: { ...classData, status: "started" },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error validating class", error: error.message });
  }
};

// ✅ 3. Cancel a class
const cancelClass = (req, res) => {
  try {
    const { id } = req.params;
    const classData = ClassModel.getClassById(id);

    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    ClassModel.updateClass(id, { status: "cancelled" });

    res.status(200).json({
      message: "Class cancelled successfully",
      classData: { ...classData, status: "cancelled" },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error cancelling class", error: error.message });
  }
};

const createClass = (req, res) => {
  try {
    const { courseId, instructorId, crn, classLimit, schedule } = req.body;
    const enrolled = 0;
    // ✅ Check if all required fields are provided
    if (!courseId || !instructorId || !schedule) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const id = uuidv4();
    // ✅ Check if the class ID already exists
    const existingClass = ClassModel.getClassById(id);
    if (existingClass) {
      return res
        .status(409)
        .json({ message: "Class with this ID already exists" });
    }

    // ✅ Check if the course ID exists
    const existingCourse = CourseModel.getCourseById(courseId);
    if (!existingCourse) {
      return res.status(404).json({ message: "Course ID does not exist" });
    }

    // ✅ Check if the instructor ID exists
    const existingInstructor = InstructorModel.getInstructorById(instructorId);
    if (!existingInstructor) {
      return res.status(404).json({ message: "Instructor ID does not exist" });
    }

    // ✅ Create the new class
    const newClass = {
      id,
      courseId,
      instructorId,
      crn,
      classLimit,
      enrolled,
      schedule,
      status: "pending",
    };

    const success = ClassModel.addClass(newClass);
    if (!success) {
      return res.status(500).json({ message: "Error adding the class" });
    }

    res
      .status(201)
      .json({ message: "Class created successfully", class: newClass });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating class", error: error.message });
  }
};

module.exports = { getAllClasses, validateClass, cancelClass, createClass };
