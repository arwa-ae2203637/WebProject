const express = require("express");
const router = express.Router();
const {
  getAllCourses,
  createCourse,
  getAllCategories,
} = require("../controllers/courses");

// ✅ Get all courses
router.get("/", getAllCourses);

router.get("/getAllCategories", getAllCategories);
// ✅ Create a new course
router.post("/", createCourse);

module.exports = router;
