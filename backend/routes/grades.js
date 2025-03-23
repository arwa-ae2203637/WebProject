const express = require("express");
const { submitStudentGrades } = require("../controllers/grades");

const router = express.Router();

router.post("/", submitStudentGrades);

module.exports = router;
