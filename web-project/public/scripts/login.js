import {fetchUsers } from "./data-handling.js";

document.addEventListener("DOMContentLoaded", async function () {

    let users = await fetchUsers();
    console.log("Login page users: ");
    console.log(users);

    const loginButton = document.getElementById("login-button");

    loginButton.addEventListener("click", function (event) {
        event.preventDefault(); 

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        if (username === "" || password === "") {
            alert("Please fill in both fields.");
            return;
        }

        const user = users.find(user => user.username === username && user.password === password);
        if (!user) {
            alert("Invalid username or password.");
            return;
        }
        localStorage.setItem("loggedUser", JSON.stringify({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            userType: user.userType,
        }));

        if(user.userType === "admin"){
            window.location.href = "./admin-course-management.html"; 
        }
        else if(user.userType === "student"){
            window.location.href = "./student-registration.html"; 
        }
        else if(user.userType === "instructor"){
            window.location.href = "./instructor-dashboard-screen.html"; 
        }

    });
});