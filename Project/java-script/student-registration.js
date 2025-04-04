import { Course } from "../models/course.js";

document.addEventListener("DOMContentLoaded", async () => {
    let courses = [];

    try{
        const response = await fetch("../assets/data/courses.json");
        const data = await response.json();
        
        courses = data.map(course => Course.fromJSON(course));
        console.log(courses);
    }
    catch(error){
        console.error("Error loading courses:", error);
    }

    updateCourseTables(courses);

});

function updateCourseTables(courses){
    if(courses.length > 0){
        const completedCoursesTable = document.querySelector(".tableBody");
        completedCoursesTable.innerHTML = courses.map(course => 
            // console.log(course)
          `<tr>
          <td>${course.name}</td>
          <td>${course.id}</td>
          <td>${course.category}</td>
          <td>${course.credit_hours}</td>
          <td>${course.campus}</td>
          <td>${course.status}</td>
          <td><button>View</button></td>
      </tr>`
        ).join('');

    }
}