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
        loadCategories();
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
        if(filteredCourses.length === 0){
            const completedCoursesTable = document.querySelector(".tableBody");
            completedCoursesTable.innerHTML = "<tr><td colspan='7'>No courses found</td></tr>";
            return;
        }
        updateCourseTables(filteredCourses);
    }

    async function loadCategories() {
        try{
          const cateogriesResponse = await fetch("/assets/categories.json");   
          const categories = await cateogriesResponse.json();
          if(categories){
            let categoryFilter = document.querySelector(".category-filter");
            const allOption = categoryFilter.querySelector('option[value=""]');
            categoryFilter.innerHTML = "";
            if (allOption) categoryFilter.appendChild(allOption);
        
            categories.forEach((category) => {
              const option = document.createElement("option");
              option.value = category.toLowerCase();
              option.textContent = category;
              categoryFilter.appendChild(option);
            });
    
          }
        }
        catch (error) {
            console.error("Error loading categories:", error);
            showNotification("Failed to load categories: " + error.message, "error");
          }
      }

