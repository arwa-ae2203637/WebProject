"use client";
import "../layout.css";
import "./admin-course-management.css";
import { useState, useEffect } from "react";
import * as dh from "../data-handling.js";
import AddCourseModal from "./components/AddCourseModal";
import AddClassModal from "./components/AddClassModal";
import {Plus} from "lucide-react";
// import * as actions from "../actions.js";

export default function AdminCourseManagement() {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loggedUser, setLoggedUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "", visible: false });

  useEffect(() => {
    async function initData() {
      try {
        const fetchedUsers = await dh.fetchUsers();
        setUsers(fetchedUsers);
        setLoggedUser(dh.getLoggedUser(users));
        await refreshData();
        await loadCategories();
      } catch (error) {
        console.error("Error initializing data:", error);
        showNotification("Failed to load initial data", "error");
      }
    }
    
    initData();
  }, []);

  const refreshData = async () => {
    try {
      const data = await loadCoursesAndClasses();
      setCourses(data.courses);
      setClasses(data.classes);
    } catch (error) {
      console.error("Error refreshing data:", error);
      showNotification("Failed to refresh data", "error");
    }
  };

  const loadCoursesAndClasses = async () => {
    try {
      const classes = await dh.fetchClasses();
      const courses = await dh.fetchCourses();
      return { classes, courses };
    } catch (error) {
      console.error("Error loading courses and classes:", error);
      return { classes: [], courses: [] };
    }
  };

  const loadCategories = async () => {
    try {
      const categoriesResponse = await fetch("/assets/categories.json");
      const categoriesData = await categoriesResponse.json();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error loading categories:", error);
      showNotification("Failed to load categories", "error");
    }
  };

  const showNotification = (message, type = "info") => {
    setNotification({ message, type, visible: true });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  const formatSchedule = (days, startTime, endTime) => {
    const dayMap = { sun: "S", mon: "M", tue: "T", wed: "W", thu: "TH" };
    const formattedDays = days.map((day) => dayMap[day]).join("/");

    const formatTime = (timeStr) => {
      const [hours, minutes] = timeStr.split(":");
      return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
    };
    
    return `${formattedDays} ${formatTime(startTime)}-${formatTime(endTime)}`;
  };

  const handleCourseSubmit = async (formData) => {
    try {
      formData.prerequisites = formData.prerequisites.join(", ");
      console.log("Course data to be added:", formData);
      await dh.addCourse(formData);
      setIsAddCourseModalOpen(false);
      await refreshData();
      showNotification("Course added successfully", "success");
    } catch (error) {
      console.error("Error adding course:", error);
      showNotification("Failed to add course: " + error.message, "error");
    }
  };

  const handleClassSubmit = async (formData) => {
    try {
      console.log("Class data to be added:", formData);
      await dh.addClass(formData);
      
      const instructor = users.find(user => user.id === parseInt(formData.instructor));
      if (instructor) {
        instructor.assigned_classes.push(formData.crn);
        await dh.updateUser(instructor.id, instructor);
      }
      
      setIsAddClassModalOpen(false);
      await refreshData();
      showNotification("Class added successfully", "success");
    } catch (error) {
      console.error("Error adding class:", error);
      showNotification("Failed to add class: " + error.message, "error");
    }
  };

  const handleCourseStatusChange = async (courseId, newStatus) => {
    try {
      const course = courses.find((course) => course.id === courseId);
      if (!course) throw new Error("Course not found");
      const { classes, enrollment, ...courseDataWithoutClasses } = course;

      courseDataWithoutClasses.status = newStatus;
      await dh.updateCourse(courseId, courseDataWithoutClasses);
      await refreshData();
    } catch (error) {
      console.error("Error changing course status:", error);
      showNotification("Failed to update course status", "error");
    }
  };

  const handleClassStatusChange = async (classId, newStatus) => {
    try {
      const cls = classes.find((cls) => cls.crn === classId);
      if (!cls) throw new Error("Class not found");
      const { course, instructor,enrollments, ...classData } = cls;
      classData.status = newStatus;
      
      await dh.updateClass(classId, classData);
      
      // Update students' course status if needed
      const students = users.filter(user => user.userType === "student");
      await Promise.all(
        students.map(async (student) => {
          let updated = false;
          for (const enrollment of student.enrollments || []) {
            if (enrollment.course_id === cls.course_id && enrollment.status === "pending") {
              console.log("here");
              await dh.updateEnrollment(enrollment.id, { status: "current" });
            }
          }          
          // if (updated) {
          //   const { classes, ...studentDataWithoutClasses } = student;
          //   await dh.updateUser(student.id, studentDataWithoutClasses);
          // }
        })
      );
      
      await refreshData();
      showNotification(`Class ${newStatus.toLowerCase()} successfully`, "success");
    } catch (error) {
      console.error(`Error updating class status to ${newStatus}:`, error);
      showNotification(`Failed to update class: ${error.message}`, "error");
    }
  };

  const handleAddClassClick = (courseId) => {
    const course = courses.find((course) => course.id === courseId);
    if (course.status === "Closed") {
      showNotification("Cannot add class to a closed course", "error");
      return;
    }
    setSelectedCourseId(courseId);
    setIsAddClassModalOpen(true);
  };

  const filteredCourses = courses.filter(course => {
    const matchesCategory = categoryFilter === "all" || 
      course.category.toLowerCase().includes(categoryFilter.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
      course.status.toLowerCase().includes(statusFilter.toLowerCase());
    return matchesCategory && matchesStatus;
  });

  // Function to get instructor name from instructor ID
  const getInstructorName = (instructorId) => {
    const instructor = users.find(user => user.id === instructorId);
    return instructor ? `${instructor.firstName} ${instructor.lastName}` : "Unknown";
  };

  return (
    <>
      <div className="header">
        <div>
          <h2 className="title">QU Student Management</h2>
          <p>Course Management</p>
        </div>
        <div className="user-profile">
          <div className="avatar">
            {loggedUser ? `${loggedUser.firstName.charAt(0)}${loggedUser.lastName.charAt(0)}`.toUpperCase() : "UN"}
          </div>
          <span className="user-name">
            {loggedUser ? `${loggedUser.firstName} ${loggedUser.lastName.charAt(0)}`.trim() : "User Name"}
          </span>
          <span className="dropdown-icon">▼</span>
        </div>
      </div>

      <div className="side">
        <div>
          <div className="title">
            <img src="../assets/media/qu-logo.png" alt="logo" />
            <h2>Qatar University Portal</h2>
          </div>
          <div className="space-box"></div>
          <nav>
            <div className="options">
              <img src="../assets/icons/dashboard-icon.svg" alt="Dashboard icon" />
              <a href="./admin-dashboard" className="active">Dashboard</a>
            </div>
            <div className="options">
              <img src="../assets/icons/registration-icon.png" alt="Registration icon" />
              <a href="#"> Course Management</a>
            </div>
            <div className="options">
                <img src="/assets/icons/statistics.svg" />
                <a href="/statistics"> System Statistics</a>
              </div>
          </nav>
        </div>
        <div className="sidebar-footer">
          <div className="options">
            <img src="../assets/icons/circle-help.svg" alt="Help icon" />
            <a href="#">Help</a>
          </div>
          <div className="options">
            <img src="../assets/icons/phone.svg" alt="Contact icon" />
            <a href="#">Contact us</a>
          </div>
          <div className="options">
            <img src="../assets/icons/log-out.svg" alt="Logout icon" />
            <a href="./login">Log out</a>
          </div>
        </div>
      </div>

      <main>
        <div className="dashboard-header">
          <h2>Course Management</h2>
          <button 
          
            id="add-course-btn" 
            className="add-btn"
            onClick={() => {
              console.log("Add Course button clicked");
              setIsAddCourseModalOpen(true)
            }}
          >
            <Plus className="material-icons"/>
            Add Course
          </button>
        </div>

        <div className="filter-section">
          <div className="filter-group">
            <label htmlFor="status-filter">Status:</label>
            <select 
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="pending">Pending Validation</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="category-filter">Category:</label>
            <select 
              id="category-filter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All</option>
              {categories.map((category, index) => (
                <option key={index} value={category.toLowerCase()}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="courses-container">
          {filteredCourses.length === 0 ? (
            <div className="error-message">
              No courses found. Add a new course to get started.
            </div>
          ) : (
            filteredCourses.map((course) => (
              <div className="course-card" key={course.id} data-course-id={course.id}>
                <div className="course-header">
                  <div className="course-title">{course.name}</div>
                  <div className="course-badges"> 
                    <span className="badge category-badge">{course.category}</span> 
                  </div>
                  <div className="status-btn-container">
                    <button 
                      className={`status-button ${course.status === "Active" ? "active" : ""}`}
                      onClick={() => handleCourseStatusChange(course.id, "Active")}
                    >
                      Active
                    </button>
                    <button 
                      className={`status-button ${course.status === "Pending" ? "active" : ""}`}
                      onClick={() => handleCourseStatusChange(course.id, "Pending")}
                    >
                      Pending
                    </button>
                    <button 
                      className={`status-button ${course.status === "Closed" ? "active" : ""}`}
                      onClick={() => handleCourseStatusChange(course.id, "Closed")}
                    >
                      Closed
                    </button>
                  </div>
                </div>
                <div className="course-details">
                  <p><strong>Credit Hours:</strong> {course.credit_hours}</p>
                  <p><strong>Prerequisites:</strong> {course.prerequisites && course.prerequisites.length > 0 ? course.prerequisites : "None"}</p>
                </div>
                <div className="class-container" id={`class-container-${course.id}`}>
                  <h4>Classes</h4>
                  <div className="class-cards">
                    {classes.filter(cls => cls.course_id === course.id).length === 0 ? (
                      <div className="error-message">
                        No classes found for this course. Add a new class to get started.
                      </div>
                    ) : (
                      classes
                        .filter(cls => cls.course_id === course.id)
                        .map(cls => {
                          const isPending = cls.status !== "active";
                          const isCancelled = cls.status === "closed";
                          const validateDisabled = !isPending;
                          const cancelDisabled = isCancelled;
                          const cancelBtnText = isCancelled ? "Cancelled" : "Cancel";
                          
                          // Get instructor name from ID - fix for the object rendering issue
                          const instructorName = typeof cls.instructor === 'object' 
                            ? `${cls.instructor.firstName} ${cls.instructor.lastName}`
                            : getInstructorName(cls.instructor);

                          return (
                            <div 
                              className="class-card" 
                              key={cls.crn} 
                              data-class-id={cls.crn} 
                              data-course-id={course.id}
                              data-instructor-id={typeof cls.instructor === 'object' ? cls.instructor.id : cls.instructor}
                            >
                              <div className="class-header">
                                <span className="crn">CRN: {cls.crn}</span>
                                <span className={`badge class-status-badge ${cls.status ? cls.status.toLowerCase() : 'pending'}`}>
                                  {cls.status || 'Pending'}
                                </span>
                              </div>
                              <div className="class-details">
                                <p><strong>Instructor:</strong> {instructorName}</p>
                                <p><strong>Limit:</strong> {cls.class_limit} students</p>
                                <p><strong>Schedule:</strong> {cls.schedule}</p>
                              </div>
                              <div className="class-actions">
                                <button 
                                  className="validate-btn" 
                                  disabled={validateDisabled}
                                  onClick={() => handleClassStatusChange(cls.crn, "active")}
                                >
                                  Validate
                                </button>
                                <button 
                                  className="cancel-btn" 
                                  disabled={cancelDisabled}
                                  onClick={() => handleClassStatusChange(cls.crn, "closed")}
                                >
                                  {cancelBtnText}
                                </button>
                              </div>
                            </div>
                          );
                        })
                    )}
                  </div>
                  <button 
                    className="add-class-btn" 
                    data-course-id={course.id}
                    onClick={() => handleAddClassClick(course.id)}
                  >
                    <Plus className="material-icons"/> Add Class
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {notification.visible && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Modals */}
      <AddCourseModal
        isOpen={isAddCourseModalOpen}
        onClose={() => setIsAddCourseModalOpen(false)}
        onSubmit={handleCourseSubmit}
        categories={categories}
      />

      <AddClassModal
        isOpen={isAddClassModalOpen}
        onClose={() => setIsAddClassModalOpen(false)}
        onSubmit={handleClassSubmit}
        courseId={selectedCourseId}
        users={users.filter(user => user.userType === "instructor")}
        formatSchedule={formatSchedule}
      />
    </>
  );
}