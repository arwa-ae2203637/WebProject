'use client';

import {fetchUsers } from "../data-handling.js";
import { useRouter } from 'next/navigation';
import { useRef } from 'react';

export default function Page() {
  const username = useRef();
  const password = useRef();
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    let users = await fetchUsers();
    console.log(users);
    console.log(username.current.value);
    console.log(password.current.value);
    if (username.current.value === "" || password.current.value === "") {
        alert("Please fill in both fields.");
        return;
    }

    const user = users.find(user => user.username === username.current.value && user.password === password.current.value);
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
      router.push("/admin-dashboard");
    }
    else if(user.userType === "student"){
       router.push("/student-dashboard");
    }
    else if(user.userType === "instructor"){
      router.push("/instructor-dashboard");
    }

  }
  return (
    <main>
    <div className="container">
        <h2>Login</h2>
        <form id="loginForm">
            <div className="input-group">
                <label htmlFor="username">Username:</label>
                <input ref={username} type="text" id="username" name="username" placeholder="example@qu.edu.qa" required/>
                
            </div>
            <div className="input-group">
                <label htmlFor="password">Password:</label>
                <input ref={password} type="password" id="password" name="password" placeholder="enter your password" required/>
            </div>
            <button type="submit" id="login-button" onClick={handleLogin}>Login</button>
        </form>
        <p id="error-message"></p>
    </div>
  </main>
);

}
