const express = require("express");
const {
  getAllInstructors,
  getInstructorById,
  getInstructorCourses,
} = require("../controllers/instructors");

const router = express.Router();

// API to get all instructors
router.get("/", getAllInstructors);
router.get("/:instructorId/courses", getInstructorCourses);

// API to get an instructor by ID
router.get("/:id", getInstructorById);

module.exports = router;
