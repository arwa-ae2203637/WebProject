import * as dh from "./data-handling.js";

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const selectedCourse = JSON.parse(localStorage.getItem("selectedCourse"));
        let courseClasses = await dh.fetchClasses();
        courseClasses = courseClasses.filter(cls => cls.course_id === selectedCourse.id);
        const users = await dh.fetchUsers();

        dh.updateUserProfile(dh.getLoggedUser(users));
        updateCourseHeader(selectedCourse);
        updateClassesTable(courseClasses,users);

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

function updateClassesTable(classes,users) {
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
      let buttonText = "Add";
      const isEnrolled = cls.students.includes(dh.getLoggedUser(users).id);
      const isClosed = cls.students.length >= cls.class_limit;

      let instructor = users.find(user => user.id === cls.instructor);
      console.log("Instructor: ", instructor);
      if(isEnrolled){
        buttonText = "Enrolled";
      }
        else if(isClosed){
            buttonText = "Closed";
        }
        else{
            buttonText = "Add";
        }
      return `
          <tr>
              <td>${cls.crn}</td>
              <td>Dr.${instructor.firstName} ${instructor.lastName}</td>
              <td class="schedule-days">${daysHtml}</td>
              <td>${time}</td>
              <td>${cls.students.length}/${cls.class_limit}</td>
              <td>${cls.students.length >= cls.class_limit ? 'Closed' : 'Available'}</td>
              <td>
              <button class="add-btn" 
                  ${isEnrolled || isClosed ? 'disabled' : ''}>
                  ${buttonText}
              </button>
             </td>
          </tr>
      `;
  }).join('');
}

async function enrollInClass(crn,course_id) {
  try {      
    const users = await dh.fetchUsers();
    const classes = await dh.fetchClasses();
    const courses = await dh.fetchCourses();

      const student = dh.getLoggedUser(users);
      const cls = classes?.find(c => c.crn === crn);
      const course = courses?.find(c => c.id === course_id);

      const hasPending = student.courses.some(c => c.course_id === course_id);
      const hasEnrolled = student.courses?.some(c => c.course_id === course_id);
      
      if (hasPending || hasEnrolled) {
          alert(hasPending 
              ? "You already have a pending request for this class"
              : "You are already enrolled in this class");
          return;
      }

      if (cls.students.length >= cls.class_limit) {
        alert("This class is already full");
        return;
    }

      if (course.prerequisites && course.prerequisites.length > 0) {
        console.log("Checking prerequisites...");
        console.log(course.prerequisites);
        const missingPrerequisites = course.prerequisites.filter(prereqId => {
            return !student.courses.some(c => 
                c.course_id === prereqId && 
                c.status === "completed" && 
                c.grade !== "F" 
            );
        });

        if (missingPrerequisites.length > 0) {
            const missingCourses = missingPrerequisites.map(id => {
                const c = courses.find(c => c.id === id);
                return c ? c.name : id;
            }).join(", ");
            
            alert(`You must complete these prerequisites first: ${missingCourses}`);
            return false;
        }
    }

    student.courses.push({
          crn: cls.crn,
          course_id: course_id,
          status: "pending",
          grade: "N/A"
      });

    cls.students.push(student.id);

      console.log("Add Course page student: ");
      console.log(student);
      console.log(cls);
      console.log(cls.students);
      dh.updateUser(student.id, student);
      dh.updateClass(cls.crn, cls);

      //// UPDATE THE CLASS TABLE
      const selectedCourse = JSON.parse(localStorage.getItem("selectedCourse"));
      const courseClasses = classes.filter(cls => cls.course_id === selectedCourse.id);
      updateClassesTable(courseClasses,users);
      alert(`Enrollment request submitted for ${selectedCourse.name} (${crn})`);
      return true;
  } catch (error) {
      console.error("Enrollment failed:", error);
      alert("Failed to process enrollment. Please try again.");
      return false;
  }
}
