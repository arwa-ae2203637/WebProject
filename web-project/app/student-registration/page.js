"use client";

import React, { useEffect, useState, useRef } from "react";
import "../layout.css";
import "./student-registration.css";
import * as dh from "../data-handling";

export default function StudentRegistration() {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loggedUser, setLoggedUser] = useState(null);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const searchInputRef = useRef(null);
  const categoryFilterRef = useRef(null);

  useEffect(() => {
    async function loadData() {
      try {
        let users = await dh.fetchUsers();
        let courses = await dh.fetchCourses();
        let classes = await dh.fetchClasses();
              
        const currentUser = await dh.getLoggedUser(users);
        setLoggedUser(currentUser);
        dh.updateUserProfile(currentUser);

        courses = courses.filter(course => course.status !== "Close");
        
        setUsers(users);
        setCourses(courses);
        setFilteredCourses(courses);
        setClasses(classes);
      
      } catch (error) {
        console.error("Error loading data:", error);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const categoriesResponse = await fetch("/assets/categories.json");   
        const categoriesData = await categoriesResponse.json();
        if (categoriesData) {
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    }

    fetchCategories();
  }, []);

  function handleFilter() {
    const searchTerm = searchInputRef.current.value.trim().toLowerCase();
    const selectedCategory = categoryFilterRef.current.value.toLowerCase();
    let filtered = [...courses];
    
    if(selectedCategory === "" && searchTerm === "") {
      setFilteredCourses(courses);
      return;
    }
    
    if(selectedCategory === "" && searchTerm !== "") {
      filtered = courses.filter(course => course.name.toLowerCase().includes(searchTerm));
    }
    
    if(selectedCategory !== "" && searchTerm === "") {
      filtered = courses.filter(course => course.category.toLowerCase().includes(selectedCategory));
    }
    
    if(selectedCategory !== "" && searchTerm !== "") {
      filtered = courses.filter(course => 
        course.category.toLowerCase().includes(selectedCategory) && 
        course.name.toLowerCase().includes(searchTerm)
      );
    }
    
    setFilteredCourses(filtered);
  }

  function handleViewClick(course) {
    localStorage.setItem("selectedCourse", JSON.stringify({
      id: course.id,
      name: course.name,
      category: course.category,
      credit_hours: course.credit_hours,
      campus: course.campus,
      status: course.status
    }));
    
    window.location.href = "./student-add-course";
  }

  return (
    <>
      <div className="header">
        <div>
          <h2 className="title">Registration </h2>
          <p>Choose your courses</p>
        </div>

        <div className="search-container">
          <div className="search-bar">
            <img src="../assets/icons/search.svg" alt="Search" className="search-icon" />
            <input 
              type="text" 
              placeholder="Search course" 
              id="search-input"
              ref={searchInputRef}
              onChange={handleFilter}
            />
          </div>
          <select 
            className="category-filter"
            ref={categoryFilterRef}
            onChange={handleFilter}
          >
            <option value="">All Categories</option>
            {categories.map((category, index) => (
              <option key={index} value={category.toLowerCase()}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="user-profile">
          <div className="avatar">US</div>
          <span className="user-name">User Name</span>
          <span className="dropdown-icon">▼</span>
        </div>
      </div>

      {/* Sidebar */}
      <div className="side">
        <div>
          <div className="title">
            <img src="../assets/media/qu-logo.png" alt="logo" />
            <h2>Qatar University Portal</h2>
          </div>
          <div className="space-box"></div>
          <nav>
            <div className="options"> 
              <img src="../assets/icons/registration-icon.png" alt="" /> 
              <a href="/student-registration" className="active">Registration</a>
            </div>
            <div className="options"> 
              <img src="../assets/icons/dashboard-icon.svg" alt="" /> 
              <a href="/student-dashboard">Dashboard</a>
            </div>
          </nav>
        </div>
        <div className="sidebar-footer">
          <div className="options"> 
            <img src="../assets/icons/circle-help.svg" alt="" /> 
            <a href="#">Help</a>
          </div>
          <div className="options"> 
            <img src="../assets/icons/phone.svg" alt="" /> 
            <a href="#">Contact us</a>
          </div>
          <div className="options"> 
            <img src="../assets/icons/log-out.svg" alt="" /> 
            <a href="/login">Log out</a>
            <div className="mb-10">.</div>
          </div>
        </div>
      </div>

      {/* Courses Table */}
      <main>
        <div className="container">
          <h2>Courses</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Course number</th>
                <th>Category</th>
                <th>Hours</th>
                <th>Campus</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="tableBody">
              {filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan="7">No courses found</td>
                </tr>
              ) : (
                filteredCourses.map((course, index) => (
                  <tr key={index}>
                    <td>{course.name}</td>
                    <td>{course.id}</td>
                    <td>{course.category}</td>
                    <td>{course.credit_hours}</td>
                    <td>{course.campus}</td>
                    <td>{course.status}</td>
                    <td>
                      <button 
                        className="view-button" 
                        data-index={index}
                        onClick={() => handleViewClick(course)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          
          {/* Pagination */}
          <div className="pages">
            <button>1</button>
            <button>2</button>
            <button>3</button>
            <button>4</button>
            <button>5</button>
            <button>...</button>
            <button>20</button>
          </div>
        </div>
      </main>
    </>
  );
}