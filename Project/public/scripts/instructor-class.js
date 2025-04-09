import * as dh from "./data-handling.js";

document.addEventListener("DOMContentLoaded", async () => {
    let users = [];
    let students = [];
    let courses = [];
    try {
      users = await dh.fetchUsers();
      const selectedClass = JSON.parse(localStorage.getItem("selectedClass"));
      courses = await dh.fetchCourses();
      const selectedCourse = courses.find(course => course.id === selectedClass.course_id);
      console.log("Selected class:", selectedClass);
  
      const loggedUser = dh.getLoggedUser(users);

      students = users.filter(user => 
        user.userType === "student" && 
        user.courses.some(course => course.crn === selectedClass.crn)
      );
  
      console.log("All students in class CRN", selectedClass.crn, ":", students);
      
      dh.updateUserProfile(loggedUser);
      updateCourseHeader(selectedClass,selectedCourse);
      updateStudentTable(students, selectedClass.crn);  
    } catch(error) {
      console.error("Error:", error);
      alert("Failed to load class data. Please try again.");
    }
  });

function updateCourseHeader(selectedClass,selectedCourse) {
    const header = document.querySelector(".course-name");
    if (header) {
        header.textContent = `${selectedCourse.name} (${selectedClass.crn})`;
    }
}

function updateStudentTable(students, selectedClassCRN) {
    const studentTable = document.querySelector(".tableBody");
    
    if (!studentTable) {
        console.error("Table body element not found");
        return;
    }

    studentTable.innerHTML = students.length > 0 
        ? students.map(student => {
            const course = student.courses.find(c => c.crn === selectedClassCRN);
            const currentGrade = course?.grade || "N/A";
            
            return `
            <tr data-student-id="${student.id}" data-crn="${selectedClassCRN}">
                <td>${student.firstName}</td>
                <td>${student.lastName}</td>
                <td>${student.username}</td>
                <td>
                    <select class="grade-dropdown" data-initial-grade="${currentGrade}">
                        <option value="A" ${currentGrade === 'A' ? 'selected' : ''}>A</option>
                        <option value="B" ${currentGrade === 'B' ? 'selected' : ''}>B</option>
                        <option value="C" ${currentGrade === 'C' ? 'selected' : ''}>C</option>
                        <option value="D" ${currentGrade === 'D' ? 'selected' : ''}>D</option>
                        <option value="F" ${currentGrade === 'F' ? 'selected' : ''}>F</option>
                        <option value="N/A" ${currentGrade === 'N/A' ? 'selected' : ''}>N/A</option>
                    </select>
                </td>
            </tr>`;
          }).join('')
        : `<tr><td colspan="4">No students enrolled</td></tr>`;

    document.querySelectorAll('.grade-dropdown').forEach(dropdown => {
        dropdown.addEventListener('change', async (e) => {
            const newGrade = e.target.value;
            const row = e.target.closest('tr');
            const studentId = row.dataset.studentId;
            const crn = row.dataset.crn;
            const initialGrade = e.target.dataset.initialGrade;

            if (newGrade === initialGrade) {
                return; 
            }

            if (confirm(`Change grade from ${initialGrade} to ${newGrade}?`)) {
                try {
                    const studentToUpdate = students.find(s => s.id == studentId);

                    const courseToUpdate = studentToUpdate.courses.find(c => c.crn === crn);

                    courseToUpdate.grade = newGrade;

                    await dh.updateUser(studentToUpdate.id, studentToUpdate);
                    e.target.dataset.initialGrade = newGrade;
                } catch (error) {
                    console.error('Error updating grade:', error);
                    e.target.value = initialGrade; 
                    alert('Failed to update grade: ' + error.message);
                }
            } else {
                e.target.value = initialGrade; 
            }
        });
    });
}