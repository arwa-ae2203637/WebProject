const express = require("express");
const router = express.Router();
const {
  getAllClasses,
  validateClass,
  cancelClass,
  createClass,
} = require("../controllers/classes");

// ✅ Get all classes
router.get("/", getAllClasses);

// ✅ Validate a class (Admin)
router.put("/:id/validate", validateClass);

// ✅ Cancel a class (Admin)
router.put("/:id/cancel", cancelClass);

// ✅ Create a new class
router.post("/", createClass);

module.exports = router;

module.exports = router;
