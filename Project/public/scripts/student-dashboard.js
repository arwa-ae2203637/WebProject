import * as dh from "./data-handling.js";

document.addEventListener("DOMContentLoaded", async () => {
  let users = [];
  let courses = [];
  let classes = [];
  try{
    users = await dh.fetchUsers();
    courses = await dh.fetchCourses();
    classes = await dh.fetchClasses();

    const loggedUser = dh.getLoggedUser(users);
        console.log("Registration page logged user:");
        console.log(loggedUser);

    dh.updateUserProfile(loggedUser);
    updateWelcomeMessage(loggedUser);
    updateCourseTables(loggedUser,courses,classes,users);
    updateProgressChart(loggedUser.courses);
  }
  catch(error){
    console.error("Error loading students:", error);
  }
});

function updateWelcomeMessage(student) {
    document.querySelector(".welcome").textContent = `Welcome, ${student.firstName}`;
}

function updateCourseTables(student, courses, classes, users) {
  const courseMap = {};
  const classMap = {};
  const instructorMap = {};
  
  users.forEach(user => {
    if (user.userType === "instructor") {
      instructorMap[user.id] = `${user.firstName} ${user.lastName}`;
    }
  });
  
  courses.forEach(course => {
      courseMap[course.id] = {
          name: course.name,
          creditHours: course.credit_hours,
          category: course.category
      };
  });
  
  classes.forEach(cls => {
      classMap[cls.crn] = {
          instructor: instructorMap[cls.instructor] || 'N/A', 
          schedule: cls.schedule
      };
  });

  console.log("Course map:", courseMap);
  console.log("Class map:", classMap);
  
  // UPDATING COMPLETED COURSES
  const completedCourses = student.courses.filter(course => course.status === "completed");
  const completedCoursesTable = document.querySelector("#completed .course-table tbody");
  completedCoursesTable.innerHTML = completedCourses.map(userCourse => {
      const courseInfo = courseMap[userCourse.course_id] || {};
      return `
      <tr>
          <td>${courseInfo.name || userCourse.course_id}</td>
          <td>${userCourse.grade}</td>
      </tr>`;
  }).join('');
  
  // UPDATING CURRENT COURSES (now shows instructor name)
  const currentCourses = student.courses.filter(course => course.status === "current");
  const currentCoursesTable = document.querySelector("#current .course-table tbody");
  currentCoursesTable.innerHTML = currentCourses.map(userCourse => {
      const courseInfo = courseMap[userCourse.course_id] || {};
      const classInfo = classMap[userCourse.crn] || {};
      return `
      <tr>
          <td>${courseInfo.name || userCourse.course_id}</td>
          <td>${classInfo.instructor || 'N/A'}</td>
      </tr>`;
  }).join('');
  
  // UPDATING PENDING COURSES
  const pendingCourses = student.courses.filter(course => course.status === "pending");
  const pendingCoursesTable = document.querySelector("#pending .course-table tbody");
  pendingCoursesTable.innerHTML = pendingCourses.map(userCourse => {
      const courseInfo = courseMap[userCourse.course_id] || {};
      return `
      <tr>
          <td>${courseInfo.name || userCourse.course_id}</td>
          <td>${courseInfo.creditHours || 'N/A'}</td>
      </tr>`;
  }).join('');
}

function updateProgressChart(userCourses) {
    const totalCourses = userCourses.length;
    const completedCount = userCourses.filter(c => c.status === "completed").length;
    const currentCount = userCourses.filter(c => c.status === "current").length;
    const pendingCount = userCourses.filter(c => c.status === "pending").length;
    
    const completedDeg = (completedCount / totalCourses) * 360;
    const currentDeg = (currentCount / totalCourses) * 360;
    
    const chart = document.querySelector(".chart");
    chart.style.backgroundImage = `conic-gradient(
        #3D051B ${completedDeg}deg,
        #6a3041 ${completedDeg}deg ${completedDeg + currentDeg}deg,
        #d1a9b1 ${completedDeg + currentDeg}deg
    )`;
    
    const chartLabel = document.querySelector(".chart-label");
    if (chartLabel) {
        const progressPercent = Math.round((completedCount / totalCourses) * 100);
        chartLabel.textContent = `${progressPercent}%`;
    }
}