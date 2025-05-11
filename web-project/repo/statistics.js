import prisma from './prisma.js';

// 1. Number of users per user type (students, instructors, admins)
export async function getUserTypeCounts() {
  return prisma.user.groupBy({
    by: ['userType'],
    _count: { _all: true },
  });
}

// 2. Number of students per course
export async function getStudentsPerCourse() {
  return prisma.enrollment.groupBy({
    by: ['course_id'],
    _count: { _all: true },
  });
}

// 3. Number of students per course category
export async function getStudentsPerCourseCategory() {
  return prisma.course.findMany({
    select: {
      category: true,
      enrollment: true,
    },
  });
}

// 4. Top 3 most enrolled courses
export async function getTopCourses() {
  return prisma.enrollment.groupBy({
    by: ['course_id'],
    _count: { _all: true },
    orderBy: { _count: { _all: 'desc' } },
    take: 3,
  });
}

// 5. Courses with the highest failure rate (grade = 'F')
export async function getCoursesWithHighestFailureRate() {
  return prisma.enrollment.groupBy({
    by: ['course_id'],
    _count: { _all: true },
    where: { grade: 'F' },
    orderBy: { _count: { _all: 'desc' } },
    take: 5,
  });
}

// 6. Average grade per course (requires post-processing for letter grades)
export async function getAverageGradePerCourse() {
  return prisma.enrollment.groupBy({
    by: ['course_id'],
    _avg: { grade: true }, // Only works if grade is numeric
  });
}

// 7. Number of students per instructor
export async function getStudentsPerInstructor() {
  return prisma.class.findMany({
    select: {
      instructor_id: true,
      enrollments: true,
    },
  });
}

// 8. Number of students failing more than 2 courses
export async function getStudentsFailingMoreThanTwoCourses() {
  const students = await prisma.enrollment.findMany({
    where: { grade: 'F' },
    select: { student_id: true },
  });
  const failCounts = {};
  students.forEach(e => {
    failCounts[e.student_id] = (failCounts[e.student_id] || 0) + 1;
  });
  return Object.entries(failCounts).filter(([_, count]) => count > 2);
}

// 9. Number of courses per category (replacement for gender distribution)
export async function getCoursesPerCategory() {
  return prisma.course.groupBy({
    by: ['category'],
    _count: { _all: true },
  });
}

// 10. Most improved student (placeholder)
export async function getMostImprovedStudent() {
  return prisma.user.findMany({
    where: { userType: 'student' },
  });
} 