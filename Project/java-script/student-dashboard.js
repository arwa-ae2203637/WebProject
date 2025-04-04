let users = [];

document.addEventListener("DOMContentLoaded", () => {
  fetch('../assets/data/users.json')
    .then(response => response.json())
    .then(data => { 
      users = data.filter(user => user.userType === "student");
      updateWelcomeMessage();
      updateUserProfile();
      updateCourseTables();
      updateProgressChart();
    })
    .catch(error => console.error("Error loading users:", error));
});

function updateWelcomeMessage() {
  if (users.length > 0) {
    document.querySelector(".welcome").textContent = `Welcome, ${users[0].firstname}`;
  }
}

function updateUserProfile() {
  if (users.length > 0) {
    const avatarElement = document.querySelector(".avatar");
    const userNameElement = document.querySelector(".user-name");
    
    avatarElement.textContent = `${users[0].firstname.charAt(0)}${users[0].lastname.charAt(0)}`  || "";  
    userNameElement.textContent = `${users[0].firstname} ${users[0].lastname.charAt(0)}` || "User Name";  
  }
}
function updateCourseTables() {
  if (users.length > 0) {
    // UPDATING COMPLETED COURSES
    const user = users[0]; 
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
}

function updateProgressChart() {
  if (users.length > 0) {
    const user = users[0];
    
    const totalCourses = user.completedCourses.length + user.currentCourses.length + user.pendingCourses.length;
    const completedCourses = user.completedCourses.length;

    const progressPercentage = (completedCourses / totalCourses) * 100;

    const progressBar = document.querySelector(".chart-progress");
    progressBar.style.width = `${progressPercentage}%`;  
    progressBar.setAttribute("data-progress", progressPercentage);

    const progressLabel = document.querySelector(".chart-label");
    progressLabel.textContent = `${Math.round(progressPercentage)}%`;
  }
}
