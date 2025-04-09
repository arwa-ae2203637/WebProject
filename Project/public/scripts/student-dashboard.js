import { getLoggedUser , getAllUsers , updateUserProfile} from "./data-handling.js";

document.addEventListener("DOMContentLoaded", async () => {
  try{
    const users = await getAllUsers();
        console.log(users);
    let loggedStudent = getLoggedUser(users);
    updateUserProfile(getLoggedUser(users));
    updateWelcomeMessage(loggedStudent);
    updateUserProfile(loggedStudent);
    updateCourseTables(loggedStudent);
    updateProgressChart(loggedStudent);
  }
  catch(error){
    console.error("Error loading students:", error);
  }
});

function updateWelcomeMessage(student) {
    document.querySelector(".welcome").textContent = `Welcome, ${student.firstName}`;
}

function updateCourseTables(student) {
    // UPDATING COMPLETED COURSES
    const user = student; 
    const completedCourses = user.completedCourses; 

    const completedCoursesTable = document.querySelector("#completed .course-table tbody");
    completedCoursesTable.innerHTML = completedCourses.map(course => 
      `<tr>
        <td>${course.name}</td>
        <td>${course.grade}</td>
      </tr>`
    ).join('');
    
    // UPDATING CURRENT COURSES
    const currentCourses = user.currentCourses; 
    const currentCoursesTable = document.querySelector("#current .course-table tbody");
    currentCoursesTable.innerHTML = currentCourses.map(course => 
      `<tr>
        <td>${course.name}</td>
        <td>${course.instructor}</td>
      </tr>`
    ).join('');
    
    // UPDATING PENDING COURSES
    const pendingCourses = user.pendingCourses;
    const pendingCoursesTable = document.querySelector("#pending .course-table tbody");
    pendingCoursesTable.innerHTML = pendingCourses.map(course => 
      `<tr>
        <td>${course.name}</td>
        <td>${course.creditHours}</td>
      </tr>`
    ).join('');

}

function updateProgressChart(student) {
    const user = student;
    
    const totalCourses = user.completedCourses.length + user.currentCourses.length + user.pendingCourses.length;
    const completedCourses = user.completedCourses.length;

    const progressPercentage = (completedCourses / totalCourses) * 100;

    const progressBar = document.querySelector(".chart-progress");
    progressBar.style.width =`${progressPercentage}%`;  
    progressBar.setAttribute("data-progress", progressPercentage);

    const progressLabel = document.querySelector(".chart-label");
    progressLabel.textContent = `${Math.round(progressPercentage)}%`;
}
