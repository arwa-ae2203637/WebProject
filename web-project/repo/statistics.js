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
  const enrollments = await prisma.enrollment.findMany({
    include: {
      course: {
        select: {
          category: true,
        },
      },
    },
  });
  const result = new Map();

  for (const enrollment of enrollments) {
    const category = enrollment.course?.category;
    if (!category) continue;

    result.set(category, (result.get(category) || 0) + 1);
  }

  return Array.from(result.entries()).map(([category, count]) => ({
    category,
    count,
  }));
}

// 4. Top 3 most enrolled courses
export async function getTopCourses() {
  return prisma.enrollment.groupBy({
    by: ['course_id'],
    _count: { 
      id: true 
    },
    orderBy: { 
      _count: { 
        id: 'desc' 
      } 
    },
    take: 3,
  });
}

// 5. Courses with the highest failure rate (grade = 'F')
export async function getCoursesWithHighestFailureRate() {
  return prisma.enrollment.groupBy({
    by: ['course_id'],
    _count: { id: true },
    where: { grade: 'F' },
    orderBy: { _count: { id: 'desc' } },
    take: 5,
  });
}

// 6. Average grade per course (requires post-processing for letter grades)
export async function getAverageGradePerCourse() {
  const enrollments = await prisma.enrollment.findMany({
    select: { course_id: true, grade: true },
  });
  const grouped = {};
  enrollments.forEach(e => {
    if (!grouped[e.course_id]) grouped[e.course_id] = [];
    const num = gradeToNumber(e.grade);
    if (num !== null) grouped[e.course_id].push(num);
  });
  return Object.entries(grouped).map(([course_id, grades]) => {
    const avg = grades.length ? (grades.reduce((a, b) => a + b, 0) / grades.length) : null;
    return {
      course_id,
      averageGrade: avg !== null ? numberToLetterGrade(avg) : null
    };
  });
}

function gradeToNumber(grade) {
  switch (grade) {
    case 'A': return 4;
    case 'B': return 3;
    case 'C': return 2;
    case 'D': return 1;
    case 'F': return 0;
    default: return null;
  }
}

function numberToLetterGrade(avg) {
  if (avg === null) return null;
  if (avg >= 3.5) return 'A';
  if (avg >= 2.5) return 'B';
  if (avg >= 1.5) return 'C';
  if (avg >= 0.5) return 'D';
  return 'F';
}


// 7. Number of students per instructor
export async function getStudentsPerInstructor() {
  const classes = await prisma.class.findMany({
    select: {
      instructor_id: true,
      instructor: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
      enrollments: {
        select: { id: true } 
      },
    },
  });

  const result = new Map();

  for (const cls of classes) {
    const name = `${cls.instructor.firstName} ${cls.instructor.lastName}`;
    const currentCount = result.get(name) || 0;
    result.set(name, currentCount + cls.enrollments.length);
  }

  return Array.from(result.entries()).map(([instructorName, studentCount]) => ({
    instructorName,
    studentCount,
  }));
}


// 8. Number of students failing more than 2 courses
export async function getStudentsFailingMoreThanTwoCourses() {
  const students = await prisma.enrollment.findMany({
    where: { grade: 'F' },
    select: { 
      student_id: true, 
      student: {
        select: {
          firstName: true,
          lastName: true,
        },
      }
    },
  });
  const failCounts = new Map();

  for (const s of students) {
    const key = s.student_id;
    const current = failCounts.get(key);

    if (current) {
      current.failCount += 1;
    } else {
      failCounts.set(key, {
        student_id: key,
        name: `${s.student.firstName} ${s.student.lastName}`,
        failCount: 1,
      });
    }
  }

  return Array.from(failCounts.values()).filter(s => s.failCount > 2);
}

// 9. Number of courses per category (replacement for gender distribution)
export async function getCoursesPerCategory() {
  return prisma.course.groupBy({
    by: ['category'],
    _count: { _all: true },
  });
}

// 10. Student with the highest average grade
export async function getStudentWithHighestAverageGrade() {
  const enrollments = await prisma.enrollment.findMany({
    select: { 
      student_id: true, 
      student: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
      grade: true 
    },
  });

  const grouped = {};
  enrollments.forEach(e => {
    if (!grouped[e.student_id]) grouped[e.student_id] = { grades: [], name: `${e.student.firstName} ${e.student.lastName}` };
    const num = gradeToNumber(e.grade);
    if (num !== null) grouped[e.student_id].grades.push(num);
  });

  let bestStudent = null;
  let bestAvg = -1;
  Object.entries(grouped).forEach(([_, data]) => {
    if (data.grades.length) {
      const avg = data.grades.reduce((a, b) => a + b, 0) / data.grades.length;
      if (avg > bestAvg) {
        bestAvg = avg;
        bestStudent = data.name;
      }
    }
  });

  return bestStudent ? { name: bestStudent } : null;
}
