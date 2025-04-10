import * as dh from "./data-handling.js";

document.addEventListener("DOMContentLoaded", async () => {

  let courses = [];
  let users = [];
  let classes = []
;
  try {
      users = await dh.fetchUsers();
      classes = await dh.fetchClasses();
      courses = await dh.fetchCourses();
      console.log(classes);

      const loggedUser = dh.getLoggedUser(users);

      let assignedClasses = classes.filter((classObj) => 
          loggedUser.assigned_classes.includes(classObj.crn)
      );
      assignedClasses = assignedClasses.filter((cls)=>cls.status == "active");

      console.log("Assigned classes:", assignedClasses);

      dh.updateUserProfile(loggedUser);
      updateClassesTables(assignedClasses,courses);

  } catch (error) {
      console.error("Error loading courses or user:", error);
  }
  document.addEventListener('click', function(event) {
      if (event.target.classList.contains('view-button')) {
          event.preventDefault();
          const row = event.target.closest('tr');
          
          const selected = classes.find(cls => cls.crn === row.cells[0].textContent);
          localStorage.setItem("selectedClass", JSON.stringify({
              crn: selected.crn,
              course_id: selected.course_id,
              instructor: selected.instructor,
              class_limit: selected.class_limit,
              schedule: selected.schedule,
              students: selected.students,
          }));
          
          window.location.href = "./instructor-class.html";
      }
  });
});

function updateClassesTables(classes, courses) {  
  if (classes.length > 0) {
      const tableBody = document.querySelector(".tableBody");

      tableBody.innerHTML = classes.map((cls, index)=> {
        const course = courses.find(c => c.id === cls.course_id);

        const [days, time = ''] = cls.schedule.split(' '); 
        const parsedDays = days.split('/').map(d => d.trim().toUpperCase()); 
        const weekDaysOrder = ['S', 'M', 'T', 'W', 'TH'];
        const daysHtml = weekDaysOrder.map(day => {
            const isScheduled = parsedDays.includes(day);
            return `<span class="day ${isScheduled ? 'scheduled' : ''}">${day}</span>`;
        }).join('');

        return `
            <tr>
                <td>${cls.crn}</td>
                <td>${course.name}</td>  <!-- Add course name column -->
                <td class="schedule-days">${daysHtml}</td>
                <td>${time}</td>
                <td>${cls.students.length}/${cls.class_limit}</td>
                <td>${cls.students.length >= cls.class_limit ? 'Closed' : 'Available'}</td>
                <td><button class="view-button" data-index="${index}">View</button></td>
            </tr>
        `;
      }).join('');
  }
}