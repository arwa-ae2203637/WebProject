"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "../layout.css";
import "./student-add-course.css";
import * as dh from "../data-handling";

export default function InstructorDashboard() {
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loggedUser, setLoggedUser] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseClasses, setCourseClasses] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      try {
        let users = await dh.fetchUsers();
        let courses = await dh.fetchCourses();
        let classes = await dh.fetchClasses();
        let allEnrollments = await dh.fetchEnrollments();
        
        const currentUser = await dh.getLoggedUser(users);
        setLoggedUser(currentUser);
        dh.updateUserProfile(currentUser);

        const selectedCourse = JSON.parse(
          localStorage.getItem("selectedCourse")
        );
        console.log("Selected course:", selectedCourse);
        setSelectedCourse(selectedCourse);
        
        setEnrollments(allEnrollments);
        
        classes = classes.map(cls => {
          const classEnrollments = allEnrollments.filter(e => e.crn === cls.crn);
          return { ...cls, enrollments: classEnrollments };
        });
        
        let courseClasses = classes.filter(
          (cls) => cls.course_id === selectedCourse.id
        );
        setCourseClasses(courseClasses);

        setUsers(users);
        setCourses(courses);
        setClasses(classes);
      } catch (error) {
        console.error("Error loading courses or user:", error);
      }
    }

    loadData();
  }, []);

  function handleViewClick(cls) {
    enrollInClass(cls);
  }

  function enrollInClass(cls) {
    try {
      const existingCourseEnrollment = enrollments.find(e => 
        e.student_id === loggedUser.id && 
        e.course_id === selectedCourse.id &&
        (e.status === "enrolled" || e.status === "pending")
      );
      
      if (existingCourseEnrollment) {
        alert("You are already enrolled or have a pending request for this course");
        return false;
      }
      
      const course = courses.find(c => c && c.id === selectedCourse.id);
      
      const prerequisites = course && course.prerequisites ? 
        course.prerequisites.split(",").filter(id => id.trim() !== "") : [];
  
      if (cls.enrollments && cls.class_limit && cls.enrollments.length >= cls.class_limit) {
        alert("This class is already full");
        return false;
      }
  
      if (prerequisites.length > 0) {
        const userCompletedCourses = enrollments.filter(e => 
          e.student_id === loggedUser.id && 
          e.status === "completed" && 
          e.grade !== "F"
        ).map(e => e.course_id);
        
        const missingPrerequisites = prerequisites.filter(prereqId => 
          !userCompletedCourses.includes(prereqId)
        );
  
        if (missingPrerequisites.length > 0) {
          const missingCourses = missingPrerequisites.map(id => {
            const c = courses.find(c => c && c.id === id);
            return c ? c.name : id;
          }).join(", ");
          
          alert(`You must complete these prerequisites first: ${missingCourses}`);
          return false;
        }
      }
  
      const newEnrollment = {
        student_id: loggedUser.id,
        crn: cls.crn,
        status: "pending",
        grade: "N/A",
        course_id: selectedCourse.id
      };
      
      dh.addEnrollment(newEnrollment);
      
      setEnrollments(prev => [...prev, newEnrollment]);
      
      setCourseClasses(prevClasses => 
        prevClasses.map(c => {
          if (c.crn === cls.crn) {
            const updatedEnrollments = c.enrollments ? [...c.enrollments, newEnrollment] : [newEnrollment];
            return { ...c, enrollments: updatedEnrollments };
          }
          return c;
        })
      );
      
      alert(`Enrollment request submitted for ${selectedCourse.name} (${cls.crn})`);
      return true;
  
    } catch (error) {
      console.error("Error enrolling in class:", error);
      alert("Failed to enroll in class. Please try again.");
      return false;
    }
  }

  const isEnrolledInCourse = () => {
    return enrollments.some(e => 
      e.student_id === loggedUser?.id && 
      e.course_id === selectedCourse?.id 
    );
  };

  const isEnrolledInClass = (crn) => {
    return enrollments.some(e => 
      e.student_id === loggedUser?.id && 
      e.crn === crn 
    );
  };

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
      .enrolled-button {
        background-color: rgba(60, 9, 24, 0.11) !important;
        cursor: default !important;
        color: rgb(91, 16, 38) !important;
      }
    `;
    document.head.appendChild(styleSheet);
    
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);
  
  return (
    <>
      <div className="header">
        <div>
          <h2 className="title">Registration</h2>
          <p>Choose your courses</p>
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
              <img
                src="../assets/icons/registration-icon.png"
                alt="registration icon"
              />
              <a href="/student-registration" className="active">
                Registration
              </a>
            </div>
            <div className="options">
              <img
                src="../assets/icons/dashboard-icon.svg"
                alt="dashboard icon"
              />
              <a href="/student-dashboard">Dashboard</a>
            </div>
          </nav>
        </div>
        <div className="sidebar-footer">
          <div className="options">
            <img src="../assets/icons/circle-help.svg" alt="help icon" />
            <a href="#">Help</a>
          </div>
          <div className="options">
            <img src="../assets/icons/phone.svg" alt="contact icon" />
            <a href="#">Contact us</a>
          </div>
          <div className="options">
            <img src="../assets/icons/log-out.svg" alt="logout icon" />
            <a href="/login">Log out</a>
          </div>
          <div className="mb-10">.</div>
        </div>
      </div>

      {/* Courses Table */}
      <main>
        <div className="container">
          <div className="course-tittle">
            <a href="/student-registration">
              <button className="back-button">↩</button>
            </a>
            <h2 className="course-name">
              {selectedCourse ? selectedCourse.name : "Loading..."} -{" "}
              {selectedCourse ? selectedCourse.id : "Loading..."}
            </h2>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>CRN</th>
                <th>Instructor</th>
                <th>Schedule</th>
                <th>Hours</th>
                <th>Availability</th>
                <th>Status</th>
                <th>Enroll</th>
              </tr>
            </thead>
            <tbody className="tableBody">
              {courseClasses && courseClasses.length > 0 ? (
                courseClasses.map((cls, index) => {
                  const course = courses.find((c) => c.id === cls.course_id);
                  const instructor = users.find(user => user.id === cls.instructor_id);
                  
                  const courseEnrolled = isEnrolledInCourse();
                  const classEnrolled = isEnrolledInClass(cls.crn);
                  const isEnrolled = classEnrolled || courseEnrolled;

                  return (
                    <tr key={index}>
                      <td>{cls.crn}</td>
                      <td>Dr.{instructor?.firstName} {instructor?.lastName}</td>
                      <td>
                        <div className="schedule-days">
                          {["S", "M", "T", "W", "TH"].map((day) => (
                            <span
                              key={day}
                              className={`day ${
                                cls.schedule.includes(day) ? "scheduled" : ""
                              }`}
                            >
                              {day}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>{course?.credit_hours}</td>
                      <td>
                        {cls.enrollments?.length || 0}/{cls.class_limit}
                      </td>
                      <td>{cls.status}</td>
                      <td>
                        <button
                          onClick={() => !isEnrolled && handleViewClick(cls)}
                          className={`view-button ${classEnrolled ? "enrolled-button" : ""}`}
                          disabled={isEnrolled}
                        >
                          {classEnrolled ? "Enrolled" : "Add"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7}>No classes available for this course</td>
                </tr>
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