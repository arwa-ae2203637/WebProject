const express = require("express");
const router = express.Router();
const { getAllDetails } = require("../controllers/common");

// ✅ Get all courses
router.get("/", getAllDetails);

module.exports = router;
