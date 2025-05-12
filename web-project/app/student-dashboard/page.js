"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "../layout.css";
import "./student-dashboard.css";
import * as dh from "../data-handling";

export default function StudentDashboard() {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loggedUser, setLoggedUser] = useState(null);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [currentCourses, setCurrentCourses] = useState([]);
  const [pendingCourses, setPendingCourses] = useState([]);
  const [progressPercent, setProgressPercent] = useState(0);
  const [chartStyle, setChartStyle] = useState({});
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      try {
        const users = await dh.fetchUsers();
        const courses = await dh.fetchCourses();
        const classes = await dh.fetchClasses();
        
        const currentUser = await dh.getLoggedUser(users);
        setLoggedUser(currentUser);
        dh.updateUserProfile(currentUser);

        setUsers(users);
        setCourses(courses);
        setClasses(classes);
        
        await processUserCourses(currentUser, courses, classes, users);

      } catch (error) {
        console.error("Error in loadData:", error);
      }
    }

    loadData();
  }, []);

  const processUserCourses = async (user, allCourses, allClasses, allUsers) => {
    const courseMap = {};
    const classMap = {};
    const instructorMap = {};
    
    allUsers.forEach(user => {
      if (user.userType === "instructor") {
        instructorMap[user.id] = `${user.firstName} ${user.lastName}`;
      }
    });
    
    allCourses.forEach(course => {
      courseMap[course.id] = {
        name: course.name,
        creditHours: course.credit_hours,
        category: course.category
      };
    });
    
    allClasses.forEach(cls => {
      classMap[cls.crn] = {
        instructor: instructorMap[cls.instructor_id] || 'N/A',
        schedule: cls.schedule
      };
    });
  
    let completed = await dh.fetchEnrollmentsByStudentAndStatus(user.id, "completed");
      completed = completed.map(enrollment => ({
      ...enrollment,
      courseName: courseMap[enrollment.course_id]?.name || enrollment.course_id,
      creditHours: courseMap[enrollment.course_id]?.creditHours || 'N/A'
    }));

    let current = await dh.fetchEnrollmentsByStudentAndStatus(user.id, "current");
      current = current.map(enrollment => ({
        ...enrollment,
        courseName: courseMap[enrollment.course_id]?.name || enrollment.course_id,
        instructor: classMap[enrollment.crn]?.instructor || 'N/A'
      }));
    
    let pending = await dh.fetchEnrollmentsByStudentAndStatus(user.id, "pending");
    pending=pending.map(enrollment => ({
        ...enrollment,
        courseName: courseMap[enrollment.course_id]?.name || enrollment.course_id,
        creditHours: courseMap[enrollment.course_id]?.creditHours || 'N/A'
      }));
    
    setCompletedCourses(completed);
    setCurrentCourses(current);
    setPendingCourses(pending);
    
    updateProgressChart(user,user.enrollments);
  };

  const updateProgressChart = async (user,enrollments) => {
 
    
    const completedEnrollments = await dh.fetchEnrollmentsByStudentAndStatus(user.id, "completed");
    const completedCount = completedEnrollments.length;
    console.log("Completed enrollments:", completedCount);
    const cureentEnrollments = await dh.fetchEnrollmentsByStudentAndStatus(user.id, "current");
    const currentCount = cureentEnrollments.length;
    const totalCourses = enrollments.length;
    if (totalCourses === 0) return;
    const completedDeg = (completedCount / totalCourses) * 360;
    const currentDeg = (currentCount / totalCourses) * 360;

    setChartStyle({
      backgroundImage: `conic-gradient(
        #3D051B ${completedDeg}deg,
        #6a3041 ${completedDeg}deg ${completedDeg + currentDeg}deg,
        #d1a9b1 ${completedDeg + currentDeg}deg
      )`
    });
    
    const progress = Math.round((completedCount / totalCourses) * 100);
    setProgressPercent(progress);
  };

  return (
    <>
      <div className="header">
        <div>
          <h2 className="welcome">Welcome, {loggedUser ? loggedUser.firstName : "Loading..."}</h2>
          <p className="sub-heading">Learning Path</p>
        </div>
        <div className="user-profile">
          <div className="avatar"></div>
          <span className="user-name">{loggedUser ? `${loggedUser.firstName} ${loggedUser.lastName}` : ""}</span>
          <span className="dropdown-icon">▼</span>
        </div>
      </div>

      <div className="side">
        <div>
          <div className="title">
            <img src="/assets/media/qu-logo.png" alt="logo" />
            <h2>Qatar University Portal</h2>
          </div>
          <div className="space-box"></div>
          <nav>
            <div className="options">
              <img src="/assets/icons/registration-icon.png" alt="Registration icon" />
              <a href="/student-registration" className="active">Registration</a>
            </div>
            <div className="options">
              <img src="/assets/icons/dashboard-icon.svg" alt="Dashboard icon" />
              <a href="/student-dashboard">Dashboard</a>
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

      <main>
        <div className="course-container">
          <div className="course-card" id="completed">
            <h3>Completed Courses</h3>
            <div className="course-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {completedCourses.length > 0 ? (
                    completedCourses.map((course, index) => (
                      <tr key={`completed-${index}`}>
                        <td>{course.courseName}</td>
                        <td>{course.grade}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="no-courses-message">No completed courses</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="course-card" id="current">
            <h3>Current Courses</h3>
            <div className="course-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Instructor</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCourses.length > 0 ? (
                    currentCourses.map((course, index) => (
                      <tr key={`current-${index}`}>
                        <td>{course.courseName}</td>
                        <td>{course.instructor}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="no-courses-message">No current courses</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="progress-chart">
              <div className="chart" style={chartStyle}>
                <div className="chart-progress" data-progress={progressPercent}></div>
                <div className="chart-label">{progressPercent}%</div>
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <p className="legend-color completed"></p>
                  <p>Completed</p>
                </div>
                <div className="legend-item">
                  <p className="legend-color pending"></p>
                  <p>Pending</p>
                </div>
                <div className="legend-item">
                  <p className="legend-color current"></p>
                  <p>Current</p>
                </div>
              </div>
            </div>
          </div>

          <div className="course-card" id="pending">
            <h3>Pending Courses</h3>
            <div className="course-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Credit Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingCourses.length > 0 ? (
                    pendingCourses.map((course, index) => (
                      <tr key={`pending-${index}`}>
                        <td>{course.courseName}</td>
                        <td>{course.creditHours}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="no-courses-message">No pending courses</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}