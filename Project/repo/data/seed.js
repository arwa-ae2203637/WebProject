const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');

// Read data from JSON files
const users = JSON.parse(fs.readFileSync('./users.json', 'utf8'));
const courses = JSON.parse(fs.readFileSync('./courses.json', 'utf8'));
const classes = JSON.parse(fs.readFileSync('./classes.json', 'utf8'));

async function main() {
  console.log('Seeding database...');

  // Insert Courses
  for (const course of courses) {
    await prisma.course.create({
      data: {
        id: course.id,
        name: course.name,
        credit_hours: Number(course.credit_hours),
        category: course.category,
        prerequisites: Array.isArray(course.prerequisites) ? course.prerequisites.join(',') : course.prerequisites,
        campus: course.campus,
        status: course.status,
      },
    });
  }

  // Insert Users
  for (const user of users) {
    await prisma.user.create({
      data: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        password: user.password,
        userType: user.userType,
        expertise_area: user.expertise_area ? user.expertise_area.join(',') : undefined,
        assigned_classes: user.assigned_classes ? user.assigned_classes.join(',') : undefined,
      },
    });
  }

  // Insert Classes
  for (const c of classes) {
    await prisma.class.create({
      data: {
        crn: Number(c.crn),
        course_id: c.course_id,
        instructorId: Number(c.instructor),
        class_limit: Number(c.class_limit),
        schedule: c.schedule,
        status: c.status,
      },
    });
  }

  console.log('Database seeded successfully!');
}

// Run it
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
