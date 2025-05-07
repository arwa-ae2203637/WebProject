import { PrismaClient } from "./client/client.js";
import * as fs from "fs/promises";
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding...");

  try {
    // Load JSON data
    const users = JSON.parse(await fs.readFile("./repo/data/users.json", "utf8"));
    const courses = JSON.parse(await fs.readFile("./repo/data/courses.json", "utf8"));
    const classes = JSON.parse(await fs.readFile("./repo/data/classes.json", "utf8"));

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
          expertise_area: user.expertise_area ? user.expertise_area.join(",") : null,
          assigned_classes: user.assigned_classes ? user.assigned_classes.join(",") : null,
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