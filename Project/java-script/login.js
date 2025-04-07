// import { User } from "./user.js";
import { Student } from "../models/student.js";
import { Instructor } from "../models/instructor.js";
import { Admin } from "../models/department-administrator.js";

document.addEventListener("DOMContentLoaded", async function () {

    let users = [];
    try {
        const response = await fetch("../assets/data/users.json");
        const data = await response.json();
        users = data.map(user => {
            switch (user.userType) {
                case "student":
                    return Student.fromJSON(user);
                case "instructor":
                    return Instructor.fromJSON(user);
                case "admin":
                    return Admin.fromJSON(user);
                default:
                    console.error("Unknown user type:", user.userType);
                    return null;
            }
        }).filter(user => user !== null);
    } catch (error) {
        console.error("Error loading users:", error);
    }

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
            window.location.href = "../html/admin-dashboard-screen.html"; 
        }
        else if(user.userType === "student"){
            window.location.href = "../html/student-registration.html"; 
        }
        else if(user.userType === "instructor"){
            window.location.href = "../html/instructor-dashboard-screen.html"; 
        }

    });


});