const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());

app.use(cors({ origin: "*" }));

const classRouter = require("./routes/classes.js");
const commonRouter = require("./routes/common.js");
const courseRouter = require("./routes/courses.js");
const instructorRouter = require("./routes/instructors.js");
const GradesRouter = require("./routes/grades.js");
app.use("/api/classes", classRouter);
app.use("/api/courses", courseRouter);
app.use("/api/instructors", instructorRouter);
app.use("/api/common", commonRouter);
app.use("/api/grades", GradesRouter);
module.exports = app;
