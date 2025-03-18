const InstructorModel = require("../models/instructors");

// Function to get all instructors
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

module.exports = { getAllInstructors, getInstructorById };
