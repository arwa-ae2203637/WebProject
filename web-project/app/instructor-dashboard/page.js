"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import '../layout.css';
import './instructor-dashboard.css';
import * as dh from "../data-handling";

export default function InstructorDashboard() {
  const [assignedClasses, setAssignedClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loggedUser, setLoggedUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      try {
        const users = await dh.fetchUsers();
        const currentUser = dh.getLoggedUser(users);
        setLoggedUser(currentUser);
        dh.updateUserProfile(currentUser);

        const classes = await dh.fetchClasses();
        const courses = await dh.fetchCourses();
     
        const instructorId = Number(currentUser.id);
        let assignedClasses = await dh.fetchClassesByInstructorAndStatus(instructorId,"active");
        setAssignedClasses(assignedClasses);
        setCourses(courses);
 
      } catch (error) {
        console.error("Error loading courses or user:", error);
      }
    }

    loadData();
  }, []);

  async function  handleViewClick(cls) {
    localStorage.setItem("selectedClass", JSON.stringify({
      crn: cls.crn,
      course_id: cls.course_id,
      instructor: cls.instructor,
      class_limit: cls.class_limit,
      schedule: cls.schedule,
      students: cls.students,
    }));
    router.push("./instructor-classes");
  }



  return (
    <>
      <div className="header">
        <div>
          <h2 className="title">Update Student Grades</h2>
          <p>Your current classes</p>
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
            <img src="assets/media/qu-logo.png" alt="logo" />
            <h2>Qatar University Portal</h2>
          </div>
          <div className="space-box"></div>
          <nav>
            <div className="options">
              <img src="/assets/icons/grade-icon.png" alt="Grade icon" />
              <a href="#">Grades</a>
            </div>
          </nav>
        </div>

        <div className="sidebar-footer">
          <div className="options">
            <img src="/assets/icons/circle-help.svg" alt="Help icon" />
            <a href="#">Help</a>
          </div>
          <div className="options">
            <img src="/assets/icons/phone.svg" alt="Contact icon" />
            <a href="#">Contact us</a>
          </div>
          <div className="options">
            <img src="/assets/icons/log-out.svg" alt="Logout icon" />
            <a href="/login">Log out</a>
          </div>
          <div className="mb-10">.</div>
        </div>
      </div>

      {/* Courses Table */}
      <main>
        <div className="container">
          <h2>Classes</h2>
          <table className="table">
            <thead>
              <tr>
                <th>CRN</th>
                <th>Course Name</th>
                <th>Schedule</th>
                <th>Hours</th>
                <th>Students Enrolled</th>
                <th>Status</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody className="tableBody">
              {assignedClasses.map((cls, index) => {
                const course = courses.find(c => c.id === cls.course_id);
                  return(<tr key={index}>
                    <td>{cls.crn}</td>
                    <td>{course.name}</td>
                    <td>
                      <div className="schedule-days">
                        {['S', 'M', 'T', 'W', 'TH'].map((day) => (
                          <span 
                            key={day} 
                            className={`day ${cls.schedule.includes(day) ? 'scheduled' : ''}`}
                          >
                            {day}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>{course.credit_hours}</td>
                    <td>{cls.enrollments?.length || 0}/{cls.class_limit}</td>
                    <td>{cls.status}</td>
                    <td>
                     
                      <button onClick={() =>handleViewClick(cls)} className="view-button">
                        View
                      </button>
                    </td>
                  </tr>);
                
})}
            </tbody>
          </table>
          <div className="pages m-3">
            <button>1</button>
            <button>2</button>
            <button>3</button>
          </div>
        </div>
      </main>
    </>
  );
}