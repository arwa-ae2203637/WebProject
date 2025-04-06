// import { Course } from "../models/course.js";

// document.addEventListener("DOMContentLoaded", async () => {
//     let courses = [];

//     try {
//         const response = await fetch("../assets/data/courses.json");
//         const data = await response.json();

//         courses = data.map(course => Course.fromJSON(course));
//         console.log(courses);
//     } catch (error) {
//         console.error("Error loading courses:", error);
//     }

//     updateCourseTables(courses);
//     const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
//     updateUserProfile(loggedUser);
//     const searchInput = document.querySelector("#search-input");
//     const categoryFilter = document.querySelector(".category-filter");

//     searchInput.addEventListener("input", () => {
//         filter(courses, searchInput, categoryFilter);
//     });
    
//     categoryFilter.addEventListener("change", () => {
//         filter(courses, searchInput, categoryFilter);
//     });
    
// });

// function updateCourseTables(courses) {

//     if (courses.length > 0) {
//         const completedCoursesTable = document.querySelector(".tableBody");
//         completedCoursesTable.innerHTML = "";
//         completedCoursesTable.innerHTML = courses.map((course, index) =>
//             `<tr>
//                 <td>${course.name}</td>
//                 <td>${course.id}</td>
//                 <td>${course.category}</td>
//                 <td>${course.credit_hours}</td>
//                 <td>${course.campus}</td>
//                 <td>${course.status}</td>
//                 <td><button class="view-button" data-index="${index}">View</button></td>
//             </tr>`
//         ).join('');

//         // Attach event listeners after rendering
//         const viewButtons = document.querySelectorAll(".view-button");
//         viewButtons.forEach(button => {
//             button.addEventListener("click", function (event) {
//                 event.preventDefault();
//                 const index = this.getAttribute("data-index");
//                 const course = courses[index];

//                 localStorage.setItem("viewedCourse", JSON.stringify({
//                     id: course.id,
//                     name: course.name,
//                     category: course.category,
//                     credit_hours: course.credit_hours,
//                     campus: course.campus,
//                     status: course.status,
//                 }));

//                 // You can optionally navigate or open a modal here
//                 window.location.href = "../html/student-dashboard-screen.html";
//             });
//         });
//     }
// }

// function filter(courses, search, category){
//     const searchTerm = search.value.trim().toLowerCase();
//     const selectedCategory = category.value.toLowerCase();
//     let filteredCourses = [...courses];
//     // if (selectedCategory === "" && searchTerm === "") {
//     //     updateCourseTables(filteredCourses);

//     // }
//     if(selectedCategory === "" && searchTerm !== ""){
//          filteredCourses = courses.filter(course => course.name.toLowerCase().includes(searchTerm));
//     }
//     if(selectedCategory !== "" && searchTerm === ""){
//          filteredCourses = courses.filter(course => course.category.toLowerCase().includes(selectedCategory));
//     }
//     if(selectedCategory !== "" && searchTerm !== ""){
//          filteredCourses = courses.filter(course => course.category.toLowerCase().includes(selectedCategory) && course.name.toLowerCase().includes(searchTerm));
//     }
//     updateCourseTables(filteredCourses);
// }

// function updateUserProfile(student) {
//     const avatarElement = document.querySelector(".avatar");
//     const userNameElement = document.querySelector(".user-name");
    
//     avatarElement.textContent = `${student.firstName.charAt(0)}${student.lastName.charAt(0)}`  || "";  
//     userNameElement.textContent = `${student.firstName} ${student.lastName.charAt(0)}` || "User Name";  
// }

//import { Course } from "../models/course.js";
import { loadData, getLoggedUser, updateUserProfile } from "./data-handling.js";

document.addEventListener("DOMContentLoaded", async () => {
    let courses = [];

    try {
        const { courses: loadedCourses, users } = await loadData();
        courses = loadedCourses;
        console.log(courses);
        console.log(users);

        updateCourseTables(courses);

        const loggedUser = getLoggedUser(users);
        console.log(loggedUser);
        updateUserProfile(loggedUser);

        const searchInput = document.querySelector("#search-input");
        const categoryFilter = document.querySelector(".category-filter");

        searchInput.addEventListener("input", () => {
            filter(courses, searchInput, categoryFilter);
        });

        categoryFilter.addEventListener("change", () => {
            filter(courses, searchInput, categoryFilter);
        });


    } catch (error) {
        console.error("Error loading courses or user:", error);
    }
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('view-button')) {
            event.preventDefault();
            const row = event.target.closest('tr');
            
            localStorage.setItem("selectedCourse", JSON.stringify({
                id: row.cells[1].textContent,
                name: row.cells[0].textContent,
                category: row.cells[2].textContent,
                credit_hours: row.cells[3].textContent,
                campus: row.cells[4].textContent,
                status: row.cells[5].text 
            }));
            
            window.location.href = "../html/student-add-course.html";
        }
    });
});

function updateCourseTables(courses) {

    if (courses.length > 0) {
        const completedCoursesTable = document.querySelector(".tableBody");
        completedCoursesTable.innerHTML = "";
        completedCoursesTable.innerHTML = courses.map((course, index) =>
            `<tr>
                <td>${course.name}</td>
                <td>${course.id}</td>
                <td>${course.category}</td>
                <td>${course.credit_hours}</td>
                <td>${course.campus}</td>
                <td>${course.status}</td>
                <td><button class="view-button" data-index="${index}">View</button></td>
            </tr>`
        ).join('');

    }
}

function filter(courses, search, category){
    const searchTerm = search.value.trim().toLowerCase();
    const selectedCategory = category.value.toLowerCase();
    let filteredCourses = [...courses];
    // if (selectedCategory === "" && searchTerm === "") {
    //     updateCourseTables(filteredCourses);

    // }
    if(selectedCategory === "" && searchTerm !== ""){
         filteredCourses = courses.filter(course => course.name.toLowerCase().includes(searchTerm));
    }
    if(selectedCategory !== "" && searchTerm === ""){
         filteredCourses = courses.filter(course => course.category.toLowerCase().includes(selectedCategory));
    }
    if(selectedCategory !== "" && searchTerm !== ""){
         filteredCourses = courses.filter(course => course.category.toLowerCase().includes(selectedCategory) && course.name.toLowerCase().includes(searchTerm));
    }
    updateCourseTables(filteredCourses);
}
