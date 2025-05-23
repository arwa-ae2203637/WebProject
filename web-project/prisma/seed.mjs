// Toggle this flag to enable/disable large data generation
const GENERATE_LARGE_DATA = true; // Set to false to use the JSON files only(set to true for realistic data)

import { faker } from '@faker-js/faker';

import { PrismaClient } from "./client/client.js";
import * as fs from "fs/promises";
const prisma = new PrismaClient();

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFromArray(arr) {
  return arr[getRandomInt(0, arr.length - 1)];
}

const firstNames = [
  "Ali",
  "Sara",
  "Mohammed",
  "Fatima",
  "Omar",
  "Layla",
  "Hassan",
  "Aisha",
  "Yousef",
  "Mariam",
];
const lastNames = [
  "Al-Khalifa",
  "Al-Thani",
  "Al-Sulaiti",
  "Al-Mansoori",
  "Al-Mohannadi",
  "Al-Kuwari",
  "Al-Obaidli",
  "Al-Naimi",
  "Al-Dosari",
  "Al-Jaber",
];
const instructorExpertise = [
  "Mathematics",
  "Computer Science",
  "Physics",
  "Chemistry",
  "Biology",
  "Engineering",
  "Business",
  "History",
  "Literature",
  "Economics",
];
const courseNames = [
  "Introduction to Programming",
  "Calculus I",
  "Physics for Engineers",
  "General Chemistry",
  "Biology Basics",
  "World History",
  "Microeconomics",
  "English Composition",
  "Statistics",
  "Linear Algebra",
  "Database Systems",
  "Software Engineering",
  "Digital Logic",
  "Thermodynamics",
  "Genetics",
  "Business Management",
  "Marketing Principles",
  "Arabic Literature",
  "Islamic Studies",
  "Environmental Science",
  "Artificial Intelligence",
  "Data Structures",
  "Operating Systems",
  "Discrete Math",
  "Project Management",
  "Financial Accounting",
  "Macroeconomics",
  "Creative Writing",
  "Modern Art",
  "Civil Engineering",
  "Electrical Circuits",
  "Organic Chemistry",
  "Cell Biology",
  "Political Science",
  "International Relations",
  "Psychology",
  "Sociology",
  "Philosophy",
  "Ethics",
  "Public Speaking",
  "Robotics",
  "Machine Learning",
  "Web Development",
  "Mobile App Dev",
  "Cloud Computing",
  "Cybersecurity",
  "Game Design",
  "Entrepreneurship",
  "Supply Chain",
  "Human Resources",
];
const categories = [
  "Programming",
  "Database",
  "Mathematics",
  "Science",
  "Language",
  "Business",
  "Medicine",
];
const campuses = ["Main", "West", "East"];
const schedules = ["Mon 9-11", "Tue 10-12", "Wed 1-3", "Thu 2-4"];
const grades = ["A", "B", "C", "D", "F"];
const years = [1, 2, 3, 4];
const genders = ["Male", "Female"];

async function main() {
  console.log("Seeding...");

  if (GENERATE_LARGE_DATA) {
    console.log(
      "Generating large dataset (500+ students, 50+ courses, etc.)..."
    );
    // 1. Create 10 instructors
    console.log("Creating instructors...");
    const instructorIds = [];
    for (let i = 4; i <= 10; i++) {
      const firstName = randomFromArray(firstNames);
      const lastName = randomFromArray(lastNames);
      const expertise = randomFromArray(instructorExpertise);
      const instructor = await prisma.user.create({
        data: {
          firstName,
          lastName,
          username: `instructor${i}@qu.edu.qa`,
          password: "123",
          userType: "instructor",
          expertise_area: expertise,
          assigned_classes: null,
        },
      });
      instructorIds.push(instructor.id);
    }
    // 1b. Create 5 admin users
    console.log("Creating admin users...");
    for (let i = 1; i <= 5; i++) {
      const firstName = randomFromArray(firstNames);
      const lastName = randomFromArray(lastNames);
      await prisma.user.create({
        data: {
          firstName,
          lastName,
          username: `admin${i}@qu.edu.qa`,
          password: "123",
          userType: "admin",
          expertise_area: null,
          assigned_classes: null,
        },
      });
    }
    // 2. Create 50 courses with realistic names and categories
    //  Courses
    console.log("Creating courses...");
    const courseIds = [];
    for (let i = 0; i < 50; i++) {
      const course = await prisma.course.create({
        data: {
          id: `C${100 + i}`,
          name: courseNames[i],
          credit_hours: getRandomInt(2, 4),
          category: randomFromArray(categories),
          prerequisites: null,
          campus: randomFromArray(campuses),
          status: "active",
        },
      });
      courseIds.push(course.id);
    }

    // Classes
    console.log("Creating classes...");
    const classCrns = new Map();
    for (let i = 0; i < courseIds.length; i++) {
      for (let j = 1; j <= 2; j++) {
        const crn = 1000 + i * 2 + j;
        const instructorId = randomFromArray(instructorIds);
        const cls = await prisma.class.create({
          data: {
            crn: String(crn),
            course_id: courseIds[i],
            instructor_id: instructorId,
            class_limit: getRandomInt(30, 50),
            schedule: randomFromArray(schedules),
            status: "open",
          },
        });

        classCrns.set(cls.crn, courseIds[i]);
      }
    }

    // Students
    console.log("Creating students...");
    const studentIds = [];
    for (let i = 0; i < 500; i++) {
      const student = await prisma.user.create({
        data: {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          username: faker.internet.email({ provider: "qu.edu.qa" }),
          password: "password",
          userType: "student",
        },
      });
      studentIds.push(student.id);
    }

    // Enrollments
    console.log("Creating enrollments...");
    let enrollmentCount = 0;
    for (const studentId of studentIds) {
      const selectedCrns = faker.helpers.arrayElements(
        classCrns,
        getRandomInt(4, 7)
      );
      for (const cls of selectedCrns) {
        await prisma.enrollment.create({
          data: {
            student: {connect:{  id: studentId }},
            class: {connect:{  crn: String(cls[0]) }},
            course: {connect:{  id: cls[1] }}, 
            status: randomFromArray(["enrolled", "completed"]),
            grade: randomFromArray(grades),
          },
        });
        enrollmentCount++;
      }
    }

    console.log(
      `Created 10 instructors, 50 courses, 100 classes, 500 students, and ${enrollmentCount} enrollments.`
    );
    console.log("Large data generation complete!");
    return;
  }

  try {
    // Load JSON data
    const users = JSON.parse(
      await fs.readFile("./repo/data/users.json", "utf8")
    );
    const courses = JSON.parse(
      await fs.readFile("./repo/data/courses.json", "utf8")
    );
    const classes = JSON.parse(
      await fs.readFile("./repo/data/classes.json", "utf8")
    );
    console.log("From file")
    // Step 1: Create all courses first
    console.log("Creating courses...");
    for (const course of courses) {
      await prisma.course.create({
        data: {
          id: course.id,
          name: course.name,
          credit_hours: Number(course.credit_hours),
          category: course.category,
          prerequisites: Array.isArray(course.prerequisites)
            ? course.prerequisites.join(",")
            : course.prerequisites,
          campus: course.campus,
          status: course.status,
        },
      });
    }
    console.log(`Created ${courses.length} courses`);

    // Step 2: Create all users (without enrollments)
    console.log("Creating users...");
    for (const user of users) {
      await prisma.user.create({
        data: {
          id: Number(user.id),
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          password: user.password,
          userType: user.userType,
          expertise_area: user.expertise_area
            ? user.expertise_area.join(",")
            : null,
          assigned_classes: user.assigned_classes
            ? user.assigned_classes.join(",")
            : null,
          // We'll create enrollments later
        },
      });
    }
    console.log(`Created ${users.length} users`);

    // Step 3: Create all classes
    console.log("Creating classes...");
    for (const cls of classes) {
      await prisma.class.create({
        data: {
          crn: cls.crn,
          course_id: cls.course_id,
          instructor_id: Number(cls.instructor),
          class_limit: Number(cls.class_limit),
          schedule: cls.schedule,
          status: cls.status,
        },
      });
    }
    console.log(`Created ${classes.length} classes`);

    // Step 4: Now create all enrollments
    console.log("Creating enrollments...");
    let enrollmentCount = 0;
    for (const user of users) {
      if (user.courses && user.courses.length > 0) {
        for (const enrollment of user.courses) {
          await prisma.enrollment.create({
            data: {
              student_id: Number(user.id),
              crn: enrollment.crn,
              course_id: enrollment.course_id,
              status: enrollment.status,
              grade: enrollment.grade,
            },
          });
          enrollmentCount++;
        }
      }
    }
    console.log(`Created ${enrollmentCount} enrollments`);

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error during seeding:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
