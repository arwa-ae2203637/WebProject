import * as dh from "./data-handling.js";

document.addEventListener("DOMContentLoaded", async () => {
    let courses = [];
    let users = [];

    try {

        users = await dh.fetchUsers();
        courses = await dh.fetchCourses();
        console.log("Registration page courses");
        console.log(courses);
        console.log("Registration page users");
        console.log(users);

        updateCourseTables(courses);

        const loggedUser = dh.getLoggedUser(users);
        console.log("Registration page logged user:");
        console.log(loggedUser);
        dh.updateUserProfile(loggedUser);

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
            
            window.location.href = "./student-add-course.html";
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
