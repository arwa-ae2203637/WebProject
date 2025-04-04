import { User } from "./user.js";

document.addEventListener("DOMContentLoaded", async function () {

    let users = [];

    try {
        const response = await fetch("../assets/data/users.json");
        const data = await response.json();
        users = data.map(user => User.fromJSON(user));
    } catch (error) {
        console.error("Error loading collection:", error);
    }

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
            name: user.name,
            username: user.username,
            userType: user.userType,
        }));

        if(user.userType === "admin"){
            window.location.href = "../html/admin-dashboard-screen.html"; 
        }
        else if(user.userType === "student"){
            window.location.href = "../html/student-dashboard-screen.html"; 
        }
        else if(user.userType === "instructor"){
            window.location.href = "../html/instructor-dashboard-screen.html"; 
        }

    });


});