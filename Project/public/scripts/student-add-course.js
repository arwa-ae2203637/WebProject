import * as dh from "./data-handling.js";

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const selectedCourse = JSON.parse(localStorage.getItem("selectedCourse"));
        let courseClasses = await dh.fetchClasses();
        courseClasses = courseClasses.filter(cls => cls.course_id === selectedCourse.id);
        // await getAllClasses(selectedCourse.id);
        const users = await dh.fetchUsers();
        console.log(`Add course page users:`);
        console.log(users);
        dh.updateUserProfile(dh.getLoggedUser(users));
        updateCourseHeader(selectedCourse);
        updateClassesTable(courseClasses);

        document.querySelectorAll('.add-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const crn = e.target.closest('tr').cells[0].textContent;
                enrollInClass(crn, selectedCourse.id);
            });
        });

    } catch(error) {
        console.error("Error:", error);
        alert("Failed to load class data. Please try again.");
    }
});

function updateCourseHeader(course) {
    const header = document.querySelector(".course-name");
    if (header) {
        header.textContent = `${course.name} (${course.id})`;
    }
}

function updateClassesTable(classes) {
    const tableBody = document.querySelector("table tbody");
    
    if (classes.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5">No classes available for this course</td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = classes.map(cls => {
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
              <td>${cls.instructor}</td>
              <td class="schedule-days">${daysHtml}</td>
              <td>${time}</td>
              <td>${cls.students.length}/${cls.class_limit}</td>
              <td>${cls.students.length >= cls.class_limit ? 'Closed' : 'Available'}</td>
              <td>
                  <button class="add-btn" ${cls.students.length >= cls.class_limit ? 'disabled' : ''}>
                      ${cls.students.length >= cls.class_limit ? 'Closed' : 'Add'}
                  </button>
              </td>
          </tr>
      `;
  }).join('');
}

async function enrollInClass(crn,course_id) {
  try {
    //   console.log(`Enrolling in class ${crn}`);
      
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

    const users = await dh.fetchUsers();
    const classes = await dh.fetchClasses();
    //   const [users, classes] = await Promise.all([
    //       getAllUsers(),
    //       getAllClasses(course_id)
    //   ]);

      const student = users?.find(u => u.id === loggedUser.id);
      const cls = classes?.find(c => c.crn === crn);
      console.log(`Add Course Student courses: `);
      console.log(student.courses);
        console.log(`Add course Class: `);
      console.log(cls);

    //   student.pendingCourses = student.pendingCourses || [];
  
      const hasPending = student.courses.some(c => c.crn === crn);
      const hasEnrolled = student.courses?.some(c => c.crn === crn);
      
      if (hasPending || hasEnrolled) {
          alert(hasPending 
              ? "You already have a pending request for this class"
              : "You are already enrolled in this class");
          return;
      }
      // Check if the class is full
      // check if class has been approved by the admin
      // update class 

    student.courses.push({
          crn: cls.crn,
          course_id: course_id,
          status: "pending",
          grade: "N/A"
      });

      console.log("Add Course page student: ");
      console.log(student);
    dh.updateUser(student.id, student);
      
      alert(`Enrollment request submitted for ${cls.name} (${crn})`);
      return true;
  } catch (error) {
      console.error("Enrollment failed:", error);
      alert("Failed to process enrollment. Please try again.");
      return false;
  }
}