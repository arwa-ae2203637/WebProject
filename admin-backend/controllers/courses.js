const { v4: uuidv4 } = require("uuid");
const CourseModel = require("../models/courses");
const ClassModel = require("../models/classes"); // Import ClassModel

const getAllCategories = (req, res) => {
  const categories = [
    "Artificial Intelligence",
    "Machine Learning",
    "Web Development",
    "Cybersecurity",
    "Data Science",
    "Software Engineering",
  ];
  res.json({ categories });
};
// ✅ 1. Get all courses
const getAllCourses = (req, res) => {
  const courseInstance = new CourseModel();
  const courses = courseInstance.getAllCourses();

  res.json(courses);
};

// ✅ 4. Create a new course
const createCourse = (req, res) => {
  const { id, name, creditHours, category, prerequisites } = req.body;

  const newCourse = {
    id: uuidv4(),
    name,
    creditHours,
    category,
    prerequisites,
    status: "pending",
  };
  CourseModel.addCourse(newCourse);

  res
    .status(201)
    .json({ message: "Course created successfully", course: newCourse });
};

module.exports = {
  getAllCourses,
  createCourse,
  getAllCategories,
};
