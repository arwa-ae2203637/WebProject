"use client";
import "../layout.css";
import "./admin-course-management.css";
import AddClassModal from "./components/AddClassModal.js";
import AddCourseModal from "./components/AddCourseModal.js";
import { useEffect, useRef, useState } from "react";
import * as actions from "../actions";
import * as dh from "../data-handling.js";

export default function Page() {
  const [courses, setCourses] = useState([]);
  const [courseClasses, setCourseClasses] = useState({});
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showClassModal, setShowClassModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const addCourseModalRef = useRef(null);
  const addClassModalRef = useRef(null);
  const addClassFormRef = useRef(null);

  useEffect(() => {
    const initializeData = async () => {
      try {
        const fetchedUsers = await dh.fetchUsers();
        const fetchedCourses = await dh.fetchCourses();
        const classesByCourse = {};
        for (const course of fetchedCourses) {
          const courseClasses = await actions.getClassByCourse(course.id);
          classesByCourse[course.id] = courseClasses || [];
        }
        setUsers(fetchedUsers);
        setCourses(fetchedCourses);
        setCourseClasses(classesByCourse);
        const loggedUser = dh.getLoggedUser(fetchedUsers);
        dh.updateUserProfile(loggedUser);
        await loadCategories();
      } catch (error) {
        console.error("Error initializing data:", error);
      }
    };
    initializeData();
  }, []);

  const loadCategories = async () => {
    try {
      const categoriesResponse = await fetch("/assets/categories.json");
      const fetchedCategories = await categoriesResponse.json();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const openModal = (modal) => {
    if (modal) modal.classList.add("show");
  };

  const closeModal = (modal) => {
    if (modal) modal.classList.remove("show");
    if (modal === addCourseModalRef.current) {
      setShowCourseModal(false);
    } else if (modal === addClassModalRef.current) {
      setShowClassModal(false);
      setSelectedCourseId(null);
    }
  };

  async function changeCourseStatus(course_id, new_status) {
    console.log("Course id: ", course_id, "New status: ", new_status);
    try {
      const result = await actions.updateCourseStatus(course_id, new_status);

      if (result.success) {
        setCourses((prevCourses) =>
          prevCourses.map((c) =>
            c.id === course_id ? { ...c, status: new_status } : c
          )
        );
        showNotification(result.message, "success");
      } else {
        showNotification(result.message, "error");
      }
    } catch (error) {
      console.error("Error changing course status:", error);
      showNotification("Failed to update course status", "error");
    }
  }

  async function changeClassStatus() {
    try {
      const result = await actions.updateClassStatus(class_id, new_status);
      if (result.success) {
        for (const courseId in courseClasses) {
          setCourseClasses((prev) => {
            const updated = { ...prev };
            updated[courseId] = prev[courseId].map((cls) =>
              cls.crn === class_id ? { ...cls, status: new_status } : cls
            );
            return updated;
          });
        }
        showNotification(result.message, "success");
      } else {
        showNotification(result.message, "error");
      }
    } catch (e) {
      console.error(`Error updating class status to ${newStatus}:`, error);
      showNotification(`Failed to update class: ${error.message}`, "error");
    }
  }

  async function handleCourseSubmit(e) {
    e.preventDefault();
    const formData = {
      id: e.target.elements["course-id"].value,
      name: e.target.elements["course-name"].value,
      credit_hours: e.target.elements["credit-hours"].value,
      category:
        e.target.elements["course-category"].value.charAt(0).toUpperCase() +
        e.target.elements["course-category"].value.slice(1),
      prerequisites: e.target.elements["prerequisites"].value,
      campus:
        e.target.elements["course-campus"].value.charAt(0).toUpperCase() +
        e.target.elements["course-campus"].value.slice(1),
      status: "Pending",
    };
    try {
      const result = await actions.addNewCourse(formData);
      if (result.success) {
        setCourses((prev) => [...prev, formData]);
        setCourseClasses((prev) => ({ ...prev, [formData.id]: [] }));

        e.target.reset();
        closeModal(addCourseModalRef.current);
        setShowCourseModal(false);

        showNotification(result.message, "success");
      } else {
        showNotification(result.message, "error");
      }
    } catch (error) {
      console.error("Error adding course:", error);
      showNotification("Failed to add course: " + error.message, "error");
    }
  }

  async function handleClassSubmit(e) {
    e.preventDefault();

    const selectedDays = Array.from(
      e.target.querySelectorAll('input[name="days"]:checked')
    ).map((checkbox) => checkbox.value);

    if (selectedDays.length === 0) {
      showNotification("Please select at least one day", "error");
      return;
    }

    const instructorValue = e.target.elements["instructor"].value;
    const instructor = users.find(
      (user) => user.id === parseInt(instructorValue)
    );
    const courseId = addClassFormRef.current.getAttribute("data-course-id");

    const formData = {
      course_id: courseId,
      instructor: parseInt(instructorValue),
      crn: e.target.elements["class-crn"].value,
      class_limit: Number(e.target.elements["class-limit"].value),
      schedule: formatSchedule(
        selectedDays,
        e.target.elements["start-time"].value,
        e.target.elements["end-time"].value
      ),
      students: [],
    };

    try {
      const result = await actions.addNewClass(formData, instructor?.id);

      if (result.success) {
        setCourseClasses((prev) => ({
          ...prev,
          [courseId]: [...(prev[courseId] || []), formData],
        }));

        if (instructor) {
          setUsers((prev) =>
            prev.map((user) => {
              if (user.id === instructor.id) {
                return {
                  ...user,
                  assigned_classes: [
                    ...(user.assigned_classes || []),
                    formData.crn,
                  ],
                };
              }
              return user;
            })
          );
        }

        e.target.reset();
        closeModal(addClassModalRef.current);
        setShowClassModal(false);
        setSelectedCourseId(null);

        showNotification(result.message, "success");
      } else {
        showNotification(result.message, "error");
      }
    } catch (error) {
      console.error("Error adding class:", error);
      showNotification("Failed to add class: " + error.message, "error");
    }
  }

  const showNotification = (message, type = "info") => {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    let container = document.querySelector(".notification-container");
    if (!container) {
      container = document.createElement("div");
      container.className = "notification-container";
      document.body.appendChild(container);
    }
    
    container.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add("fade-out");
      setTimeout(() => {
        notification.remove();
        if (container.children.length === 0) container.remove();
      }, 300);
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

  const prepareAddClassModal = (courseId) => {
    const course = courses.find((course) => course.id === courseId);
    if (course && course.status === "Closed") {
      showNotification("Cannot add class to a closed course", "error");
      return;
    }
    
    setSelectedCourseId(courseId);
    setShowClassModal(true);
    
    if (addClassFormRef.current) {
      addClassFormRef.current.setAttribute("data-course-id", courseId);
      openModal(addClassModalRef.current);
    }
  };

  const filteredCourses = courses.filter(course => {
    if (selectedCategory !== "all" && 
        !course.category.toLowerCase().includes(selectedCategory)) {
      return false;
    }
    if (selectedStatus !== "all" && 
        !course.status.toLowerCase().includes(selectedStatus)) {
      return false;
    }
    return true;
  });

  return (
    <>
      <div className="header">
        <div>
          <h2 className="title">QU Student Management</h2>
          <p>Course Management</p>
        </div>

        <div className="user-profile">
          <div className="avatar">US</div>
          <span className="user-name">User Name</span>
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
              <img src="../assets/icons/dashboard-icon.svg" />
              <a href="./admin-dashboard.html" className="active">
                Dashboard
              </a>
            </div>
            <div className="options">
              <img src="../assets/icons/registration-icon.png" />
              <a href="#"> Course Management</a>
            </div>
          </nav>
        </div>
        <div className="sidebar-footer">
          <div className="options">
            <img src="../assets/icons/circle-help.svg" />
            <a href="#">Help</a>
          </div>
          <div className="options">
            <img src="../assets/icons/phone.svg" />
            <a href="#">Contact us</a>
          </div>
          <div className="options">
            <img src="../assets/icons/log-out.svg" />
            <a href="./login.html">Log out</a>
          </div>
        </div>
      </div>

      <main>
        <div className="dashboard-header">
          <h2>Course Management</h2>
          <button id="add-course-btn" className="add-btn" onClick={() => {
              setShowCourseModal(true);
              openModal(addCourseModalRef.current);
            }}>
            <span className="material-icons">add</span>
            Add Course
          </button>
        </div>

        <div className="filter-section">
          <div className="filter-group">
            <label htmlFor="status-filter">Status:</label>
            <select id="status-filter" value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}>
              <option value="all">All</option>
              <option value="pending">Pending Validation</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="category-filter">Category:</label>
            <select id="category-filter"value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
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
              <div 
                key={course.id}
                className="course-card" 
                data-course-id={course.id}
              >
                <div className="course-header">
                  <div className="course-title">{course.name}</div>
                  <div className="course-badges">
                    <span className="badge category-badge">{course.category}</span>
                  </div>
                  <div className="status-btn-container">
                    <button 
                      className={`status-button ${course.status === "Active" ? "active" : ""}`}
                      onClick={() => changeCourseStatus(course.id, "Active")}
                    >
                      Active
                    </button>
                    <button 
                      className={`status-button ${course.status === "Pending" ? "active" : ""}`}
                      onClick={() => changeCourseStatus(course.id, "Pending")}
                    >
                      Pending
                    </button>
                    <button 
                      className={`status-button ${course.status === "Closed" ? "active" : ""}`}
                      onClick={() => changeCourseStatus(course.id, "Closed")}
                    >
                      Closed
                    </button>
                  </div>
                </div>
                <div className="course-details">
                  <p><strong>Credit Hours:</strong> {course.credit_hours}</p>
                  <p>
                    <strong>Prerequisites:</strong> 
                    {course.prerequisites.length === 0 ? "None" : course.prerequisites}
                  </p>
                </div>
                <div className="class-container" id={`class-container-${course.id}`}>
                  <h4>Classes</h4>
                  <div className="class-cards">
                    {/* Use the pre-fetched course classes instead of calling the action during render */}
                    {(courseClasses[course.id] || []).map((cls) => {
                      // Handle possible undefined values
                      const validateDisabled = cls.status === "active";
                      const cancelDisabled = cls.status === "closed";
                      const cancelBtnText = cls.status === "pending" ? "Cancel" : "Close";
                      const instructorId = cls.instructor;
                      
                      return (
                        <div 
                          key={cls.crn}
                          className="class-card" 
                          data-class-id={cls.crn} 
                          data-course-id={course.id}
                          data-instructor-id={instructorId}
                        >
                          <div className="class-header">
                            <span className="crn">CRN: {cls.crn}</span>
                            <span className={`badge class-status-badge ${cls.status ? cls.status.toLowerCase() : 'pending'}`}>
                              {cls.status || 'Pending'}
                            </span>
                          </div>
                          <div className="class-details">
                            <p><strong>Instructor:</strong> {cls.instructor}</p>
                            <p><strong>Limit:</strong> {cls.class_limit} students</p>
                            <p><strong>Schedule:</strong> {cls.schedule}</p>
                          </div>
                          <div className="class-actions">
                            <button 
                              className="validate-btn" 
                              disabled={validateDisabled}
                              onClick={() => changeClassStatus(cls.crn, "active")}
                            >
                              Validate
                            </button>
                            <button 
                              className="cancel-btn" 
                              disabled={cancelDisabled}
                              onClick={() => changeClassStatus(cls.crn, "closed")}
                            >
                              {cancelBtnText}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <button 
                    className="add-class-btn"
                    onClick={() => prepareAddClassModal(course.id)}
                  >
                    <span className="material-icons">add</span> Add Class
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
      
      {/* Modals */}
      <AddCourseModal 
        modalRef={addCourseModalRef}
        categories={categories}
        onClose={() => closeModal(addCourseModalRef.current)}
        onSubmit={handleCourseSubmit}
      />
      
      <AddClassModal 
        modalRef={addClassModalRef}
        formRef={addClassFormRef}
        instructors={users.filter(user => user.userType === "instructor")}
        onClose={() => closeModal(addClassModalRef.current)}
        onSubmit={handleClassSubmit}
      />
      {/* Add Course Modal */}
      {/* <div id="add-course-modal" className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h3>Add New Course</h3>
            <span className="close-modal">&times;</span>
          </div>
          <form id="add-course-form">
            <div className="form-group">
              <label htmlFor="course-id">
                Course Number:<span className="required">*</span>
              </label>
              <input type="text" id="course-id" required />
            </div>
            <div className="form-group">
              <label htmlFor="course-name">
                Course Name:<span className="required">*</span>
              </label>
              <input type="text" id="course-name" required />
            </div>
            <div className="form-group">
              <label htmlFor="credit-hours">
                Credit Hours:<span className="required">*</span>
              </label>
              <input type="number" id="credit-hours" min="1" max="6" required />
            </div>
            <div className="form-group">
              <label htmlFor="course-category">
                Category:<span className="required">*</span>
              </label>
              <select id="course-category" required>
                <option value="">Select a category</option>
                Categories will be loaded dynamically from API
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="course-campus">
                Campus:<span className="required">*</span>
              </label>
              <select id="course-campus" required>
                <option value="">Select a campus</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="prerequisites">
                Prerequisites (comma separated):
              </label>
              <input
                type="text"
                id="prerequisites"
                placeholder="e.g. CS101, CS102"
              />
            </div>
            <div className="form-actions">
              <button type="button" className="cancel-form-btn">
                Cancel
              </button>
              <button type="submit" className="submit-form-btn">
                Create Course
              </button>
            </div>
          </form>
        </div>
      </div> */}
      {/* Add Class Modal */}
      {/* <div id="add-class-modal" className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h3>Add New Class</h3>
            <span className="close-modal">&times;</span>
          </div>
          <form id="add-class-form">
            <div className="form-group">
              <label htmlFor="class-crn">
                CRN:<span className="required">*</span>
              </label>
              <input type="text" id="class-crn" required />
            </div>
            <div className="form-group">
              <label htmlFor="instructor">
                Instructor:<span className="required">*</span>
              </label>
              <select id="instructor" required>
                <option value="">Select an instructor</option>
                Instructors will be loaded dynamically from API
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="class-limit">
                Class Limit:<span className="required">*</span>
              </label>
              <input type="number" id="class-limit" min="5" max="50" required />
            </div>
            <div className="form-group">
              <label htmlFor="schedule-days">
                Schedule Days:<span className="required">*</span>
              </label>
              <div className="checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="days"
                    value="mon"
                    className="day-checkbox"
                  />
                  Monday
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="days"
                    value="tue"
                    className="day-checkbox"
                  />
                  Tuesday
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="days"
                    value="wed"
                    className="day-checkbox"
                  />
                  Wednesday
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="days"
                    value="thu"
                    className="day-checkbox"
                  />
                  Thursday
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="days"
                    value="sun"
                    className="day-checkbox"
                  />
                  Sunday
                </label>
              </div>
            </div>
            <div className="form-group">
              <label for="start-time">
                Start Time:<span className="required">*</span>
              </label>
              <input type="time" id="start-time" required />
            </div>
            <div className="form-group">
              <label htmlFor="end-time">
                End Time:<span className="required">*</span>
              </label>
              <input type="time" id="end-time" required />
            </div>
            <div className="form-actions">
              <button type="button" className="cancel-form-btn">
                Cancel
              </button>
              <button type="submit" className="submit-form-btn">
                Create Class
              </button>
            </div>
          </form>
        </div>
      </div> */}
    </>
  );
}

// "use client";
// import { useState, useEffect } from "react";
// import * as dh from "../data-handling";
// import CourseCard from "./CourseCard";
// import AddCourseModal from "./components/AddCourseModal";
// import AddClassModal from "./components/AddClassModal";
// import { useNotification } from "./NotificationContext";

// export default function CourseManagementPage() {
//   const [users, setUsers] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [classes, setClasses] = useState([]);
//   const [loggedUser, setLoggedUser] = useState(null);
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [categoryFilter, setCategoryFilter] = useState("all");
//   const [categories, setCategories] = useState([]);
//   const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
//   const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);
//   const [selectedCourseId, setSelectedCourseId] = useState(null);

//   const { showNotification } = useNotification();

//   // Load initial data
//   useEffect(() => {
//     async function loadInitialData() {
//       await refreshData();
//       loadCategories();
//     }
//     loadInitialData();
//   }, []);

//   // Load logged in user
//   useEffect(() => {
//     if (users.length > 0) {
//       const currentUser = dh.getLoggedUser(users);
//       setLoggedUser(currentUser);
//     }
//   }, [users]);

//   // Function to reload all data
//   async function refreshData() {
//     try {
//       const fetchedUsers = await dh.fetchUsers();
//       setUsers(fetchedUsers);

//       const data = await loadCoursesAndClasses();
//       setCourses(data.courses);
//       setClasses(data.classes);
//     } catch (error) {
//       console.error("Error refreshing data:", error);
//       showNotification("Failed to load data", "error");
//     }
//   }

//   async function loadCoursesAndClasses() {
//     try {
//       const classes = await dh.fetchClasses();
//       const courses = await dh.fetchCourses();
//       return { classes, courses };
//     } catch (error) {
//       console.error("Error loading courses and classes:", error);
//       return { classes: [], courses: [] };
//     }
//   }

//   async function loadCategories() {
//     try {
//       const categoriesResponse = await fetch("/assets/categories.json");
//       const fetchedCategories = await categoriesResponse.json();
//       setCategories(fetchedCategories);
//     } catch (error) {
//       console.error("Error loading categories:", error);
//       showNotification("Failed to load categories", "error");
//     }
//   }

//   // Filter courses based on selected filters
//   const filteredCourses = courses.filter(course => {
//     const matchesCategory = categoryFilter === "all" || 
//       course.category.toLowerCase().includes(categoryFilter.toLowerCase());
//     const matchesStatus = statusFilter === "all" || 
//       course.status.toLowerCase().includes(statusFilter.toLowerCase());
//     return matchesCategory && matchesStatus;
//   });

//   async function handleCourseStatusChange(courseId, newStatus) {
//     try {
//       const course = courses.find(course => course.id === courseId);
//       if (!course) return;

//       const updatedCourse = { ...course, status: newStatus };
//       await dh.updateCourse(courseId, updatedCourse);
//       await refreshData();
//       showNotification(`Course status updated to ${newStatus}`, "success");
//     } catch (error) {
//       console.error("Error updating course status:", error);
//       showNotification("Failed to update course status", "error");
//     }
//   }

//   async function handleClassStatusChange(classId, newStatus) {
//     try {
//       const classObj = classes.find(cls => cls.crn === classId);
//       if (!classObj) {
//         throw new Error("Class not found");
//       }
      
//       const updatedClass = { ...classObj, status: newStatus };
//       await dh.updateClass(classId, updatedClass);
      
//       // Update students' course status if needed
//       const students = users.filter(user => user.userType === "student");
//       await Promise.all(
//         students.map(async (student) => {
//           let updated = false;
//           for (const course of student.courses || []) {
//             if (course.course_id === classObj.course_id && course.status === "pending") {
//               course.status = "current";
//               updated = true;
//             }
//           }
//           if (updated) {
//             await dh.updateUser(student.id, student);
//           }
//         })
//       );
      
//       await refreshData();
//       showNotification(`Class ${newStatus} successfully`, "success");
//     } catch (error) {
//       console.error(`Error updating class status to ${newStatus}:`, error);
//       showNotification(`Failed to update class: ${error.message}`, "error");
//     }
//   }

//   async function handleAddCourse(courseData) {
//     try {
//       await dh.addCourse(courseData);
//       setIsAddCourseModalOpen(false);
//       await refreshData();
//       showNotification("Course added successfully", "success");
//     } catch (error) {
//       console.error("Error adding course:", error);
//       showNotification("Failed to add course: " + error.message, "error");
//     }
//   }

//   async function handleAddClass(classData) {
//     try {
//       const instructor = users.find(user => user.id === parseInt(classData.instructor));
      
//       // Add CRN to instructor's assigned classes
//       instructor.assigned_classes = [...instructor.assigned_classes, classData.crn];
      
//       await dh.addClass(classData);
//       await dh.updateUser(instructor.id, instructor);
      
//       setIsAddClassModalOpen(false);
//       await refreshData();
//       showNotification("Class added successfully", "success");
//     } catch (error) {
//       console.error("Error adding class:", error);
//       showNotification("Failed to add class: " + error.message, "error");
//     }
//   }

//   function openAddClassModal(courseId) {
//     const course = courses.find(course => course.id === courseId);
//     if (course.status === "Closed") {
//       showNotification("Cannot add class to a closed course", "error");
//       return;
//     }
    
//     setSelectedCourseId(courseId);
//     setIsAddClassModalOpen(true);
//   }

//   function formatUserInitials(user) {
//     if (!user) return "US";
//     return `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();
//   }

//   function formatUserName(user) {
//     if (!user) return "User Name";
//     return `${user.firstName || ""} ${user.lastName?.[0] || ""}`.trim();
//   }

//   return (
//     <div className="flex h-screen">
//       {/* Sidebar */}
//       <div className="side w-64 bg-gray-100 flex flex-col justify-between">
//         <div>
//           <div className="title p-4 flex items-center">
//             <img src="../assets/media/qu-logo.png" alt="logo" className="h-10 mr-2" />
//             <h2 className="text-lg font-bold">Qatar University Portal</h2>
//           </div>
//           <div className="space-box h-4"></div>
//           <nav className="p-4">
//             <div className="options mb-2 flex items-center">
//               <img src="../assets/icons/dashboard-icon.svg" className="mr-2" />
//               <a href="./admin-dashboard.html" className="active">Dashboard</a>
//             </div>
//             <div className="options mb-2 flex items-center">
//               <img src="../assets/icons/registration-icon.png" className="mr-2" />
//               <a href="#"> Course Management</a>
//             </div>
//           </nav>
//         </div>
//         <div className="sidebar-footer p-4">
//           <div className="options mb-2 flex items-center">
//             <img src="../assets/icons/circle-help.svg" className="mr-2" />
//             <a href="#">Help</a>
//           </div>
//           <div className="options mb-2 flex items-center">
//             <img src="../assets/icons/phone.svg" className="mr-2" />
//             <a href="#">Contact us</a>
//           </div>
//           <div className="options mb-2 flex items-center">
//             <img src="../assets/icons/log-out.svg" className="mr-2" />
//             <a href="./login.html">Log out</a>
//           </div>
//         </div>
//       </div>
      
//       {/* Main Content */}
//       <div className="flex-1 flex flex-col">
//         {/* Header */}
//         <div className="header flex justify-between items-center p-4 bg-white shadow">
//           <div>
//             <h2 className="title text-xl font-bold">QU Student Management</h2>
//             <p>Course Management</p>
//           </div>
//           <div className="user-profile flex items-center">
//             <div className="avatar w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-2">
//               {formatUserInitials(loggedUser)}
//             </div>
//             <span className="user-name mr-1">{formatUserName(loggedUser)}</span>
//             <span className="dropdown-icon">▼</span>
//           </div>
//         </div>
        
//         {/* Main area */}
//         <main className="flex-1 p-6 overflow-auto">
//           <div className="dashboard-header flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-bold">Course Management</h2>
//             <button 
//               onClick={() => setIsAddCourseModalOpen(true)}
//               className="add-btn bg-blue-500 text-white px-4 py-2 rounded flex items-center"
//             >
//               <span className="material-icons mr-1">add</span>
//               Add Course
//             </button>
//           </div>
          
//           <div className="filter-section flex mb-6">
//             <div className="filter-group mr-4">
//               <label htmlFor="status-filter" className="mr-2">Status:</label>
//               <select 
//                 id="status-filter" 
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 className="border p-2 rounded"
//               >
//                 <option value="all">All</option>
//                 <option value="pending">Pending Validation</option>
//                 <option value="active">Active</option>
//                 <option value="closed">Closed</option>
//               </select>
//             </div>
//             <div className="filter-group">
//               <label htmlFor="category-filter" className="mr-2">Category:</label>
//               <select 
//                 id="category-filter"
//                 value={categoryFilter}
//                 onChange={(e) => setCategoryFilter(e.target.value)}
//                 className="border p-2 rounded"
//               >
//                 <option value="all">All</option>
//                 {categories.map((category, index) => (
//                   <option key={index} value={category.toLowerCase()}>
//                     {category}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
          
//           <div className="courses-container">
//             {filteredCourses.length === 0 ? (
//               <div className="error-message p-4 bg-gray-100 rounded text-center">
//                 No courses found. Add a new course to get started.
//               </div>
//             ) : (
//               filteredCourses.map(course => (
//                 <CourseCard 
//                   key={course.id}
//                   course={course}
//                   classes={classes.filter(cls => cls.course_id === course.id)}
//                   onStatusChange={handleCourseStatusChange}
//                   onClassStatusChange={handleClassStatusChange}
//                   onAddClass={() => openAddClassModal(course.id)}
//                 />
//               ))
//             )}
//           </div>
//         </main>
//       </div>
      
//       {/* Modals */}
//       <AddCourseModal
//         isOpen={isAddCourseModalOpen}
//         onClose={() => setIsAddCourseModalOpen(false)}
//         onSubmit={handleAddCourse}
//         categories={categories}
//       />
      
//       <AddClassModal
//         isOpen={isAddClassModalOpen}
//         courseId={selectedCourseId}
//         onClose={() => setIsAddClassModalOpen(false)}
//         onSubmit={handleAddClass}
//         instructors={users.filter(user => user.userType === "instructor")}
//       />
//     </div>
//   );
// }