const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());

app.use(cors({ origin: "*" }));

const classRouter = require("./routes/classes.js");
const commonRouter = require("./routes/common.js");
const courseRouter = require("./routes/courses.js");
const instructorRouter = require("./routes/instructors.js");
app.use("/api/classes", classRouter);
app.use("/api/courses", courseRouter);
app.use("/api/instructors", instructorRouter);
app.use("/api/common", commonRouter);
module.exports = app;
