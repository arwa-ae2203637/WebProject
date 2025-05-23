import * as dh from "./data-handling.js";

document.addEventListener("DOMContentLoaded", async () => {

  const elements = {
    coursesContainer: document.querySelector(".courses-container"),
    addCourseBtn: document.querySelector("#add-course-btn"),
    addCourseModal: document.querySelector("#add-course-modal"),
    addClassModal: document.querySelector("#add-class-modal"),
    addCourseForm: document.querySelector("#add-course-form"),
    addClassForm: document.querySelector("#add-class-form"),
    statusFilter: document.querySelector("#status-filter"),
    categoryFilter: document.querySelector("#category-filter"),
    courseCategory: document.querySelector("#course-category"),
    instructorSelect: document.querySelector("#instructor") 
  };
  
  let users = await dh.fetchUsers();
  let courses = [];
  let classes = [];
  
  await refreshData();
  setupEventListeners();
  
  const loggedUser = dh.getLoggedUser(users);
  dh.updateUserProfile(loggedUser);

  // Function to reload all data and refresh the UI
  async function refreshData() {
    const data = await loadCoursesAndClasses();
    courses = data.courses;
    classes = data.classes;
    updateCourseTables(courses, classes);
    applyFilters(); 
  }

  function changeCourseStatus() {
    const statusButtons = document.querySelectorAll(".status-button");
    
    statusButtons.forEach((button) => {
      button.addEventListener("click", async function () {
        const courseCard = this.closest(".course-card");
        const courseId = courseCard.getAttribute("data-course-id");
        const course = courses.find((course) => course.id === courseId);
        const newStatus = this.textContent.trim();
        
        course.status = newStatus;
        await dh.updateCourse(courseId, course);
        
        const siblingButtons = courseCard.querySelectorAll(".status-button");
        siblingButtons.forEach((btn) => btn.classList.remove("active"));
        this.classList.add("active");
        
        // No need to refresh the entire page - we've updated the button UI directly
        // But we should refresh the data for any filtering operations
        await refreshData();
      });
    });
  }

  function updateCourseTables(coursesToShow, classesToShow) {
    if (!elements.coursesContainer) return;
    elements.coursesContainer.innerHTML = "";
    
    if (!coursesToShow || coursesToShow.length === 0) {
      elements.coursesContainer.innerHTML = `<div class="error-message"> No courses found. Add a new course to get started.</div>`;
      return;
    }

    coursesToShow.forEach((course) => {
      const courseCard = document.createElement("div");
      courseCard.classList.add("course-card");
      courseCard.setAttribute("data-course-id", course.id);
      
      courseCard.innerHTML = `
      <div class="course-header">
        <div class="course-title">${course.name}</div>
        <div class="course-badges"> <span class="badge category-badge">${course.category}</span> </div>
        <div class="status-btn-container">
          <button class="status-button ${course.status === "Active" ? "active" : ""}">Active</button>
          <button class="status-button ${course.status === "Pending" ? "active" : ""}">Pending</button>
          <button class="status-button ${course.status === "Closed" ? "active" : ""}">Closed</button>
        </div>
      </div>
      <div class="course-details">
        <p><strong>Credit Hours:</strong> ${course.credit_hours}</p>
        <p><strong>Prerequisites:</strong> ${course.prerequisites.length === 0 ? "None": course.prerequisites}</p>
      </div>
      <div class="class-container" id="class-container-${course.id}">
        <h4>Classes</h4>
        <div class="class-cards"> ${renderClasses(classesToShow, course.id)} </div>
        <button class="add-class-btn" data-course-id="${course.id}">
          <span class="material-icons">add</span> Add Class
        </button>
      </div>`;
      
      elements.coursesContainer.appendChild(courseCard);
    });
    
    // Reattach all event listeners after updating the DOM
    attachDynamicEventListeners();
    // Reattach course status buttons event listeners
    changeCourseStatus();
  }

  function renderClasses(classes, courseId) {
    let courseClasses = [];
    if(classes != null && classes.length > 0){
      courseClasses = classes.filter((cls) => cls.course_id === courseId);
    }
    if(!courseClasses || courseClasses.length === 0) return `<div class="error-message"> No classes found for this course. Add a new class to get started.</div>`;

    return courseClasses.map((cls) => {
        const instructorId = cls.instructorDetails?.id || "";
        const isPending = cls.status !== "active";
        const isCancelled = cls.status === "closed";

        const validateDisabled = !isPending ? "disabled" : "";
        const cancelDisabled = isCancelled ? "disabled" : "";
        const cancelBtnText = isCancelled ? "Cancelled" : "Cancel";

        return `<div class="class-card" data-class-id="${cls.crn}" data-course-id="${courseId}" data-instructor-id="${instructorId}">
          <div class="class-header">
            <span class="crn">CRN: ${cls.crn}</span>
            <span class="badge class-status-badge ${cls.status.toLowerCase()}">${cls.status}</span>
          </div>
          <div class="class-details">
            <p><strong>Instructor:</strong> ${cls.instructor}</p>
            <p><strong>Limit:</strong> ${cls.class_limit} students</p>
            <p><strong>Schedule:</strong> ${cls.schedule}</p>
          </div>
          <div class="class-actions">
            <button class="validate-btn" ${validateDisabled}>Validate</button>
            <button class="cancel-btn" ${cancelDisabled}>${cancelBtnText}</button>
          </div>
        </div>`;
      }).join("");
  }

  function openModal(modal) {
    if (modal) modal.classList.add("show");
  }

  function closeModal(modal) {
    if (modal) modal.classList.remove("show");
  }

  async function loadCategories() {
    try{
      const cateogriesResponse = await fetch("/assets/categories.json");   
      const categories = await cateogriesResponse.json();
      if(categories) populateCategoryDropdowns(categories);
    }
    catch (error) {
      console.error("Error loading categories:", error);
    }
  }

  function populateCategoryDropdowns(categories) {
    if (elements.categoryFilter) {
      const allOption = elements.categoryFilter.querySelector('option[value="all"]');
      elements.categoryFilter.innerHTML = "";
      if (allOption) elements.categoryFilter.appendChild(allOption);
      categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.toLowerCase();
        option.textContent = category;
        elements.categoryFilter.appendChild(option);
      });
    }
  
    if (elements.courseCategory) {
      const defaultOption = elements.courseCategory.querySelector('option[value=""]');
      elements.courseCategory.innerHTML = "";
      if (defaultOption) elements.courseCategory.appendChild(defaultOption);
  
      categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.toLowerCase();
        option.textContent = category;
        elements.courseCategory.appendChild(option);
      });
    }
  }

  async function loadInstructors() {
    try {
      users = await dh.fetchUsers(); // Update users data
      const instructors = users.filter(user => user.userType === "instructor");
      if (instructors) {
        populateInstructorDropdown(instructors);
      } else {
        console.error("Invalid instructors data format:");
      }
    } catch (error) {
      console.error("Error loading instructors:", error);
    }
  }

  function populateInstructorDropdown(instructors) {
    if (elements.instructorSelect) {
      const defaultOption = elements.instructorSelect.querySelector('option[value=""]');
      elements.instructorSelect.innerHTML = "";
      elements.instructorSelect.appendChild(defaultOption);

      instructors.forEach((instructor) => {
        const option = document.createElement("option");
        option.value = instructor.id;
        option.textContent = instructor.firstName + " " + instructor.lastName;
        elements.instructorSelect.appendChild(option);
      });
    }
  }

  function setupEventListeners() {
    if (elements.addCourseBtn) elements.addCourseBtn.addEventListener("click", () => openModal(elements.addCourseModal));

    document.querySelectorAll(".close-modal, .cancel-form-btn").forEach((btn) => {
        btn.addEventListener("click", () => closeModal(btn.closest(".modal")));
    });

    window.addEventListener("click", (event) => {
      if (event.target === elements.addCourseModal) closeModal(elements.addCourseModal);
      if (event.target === elements.addClassModal) closeModal(elements.addClassModal);
    });

    if (elements.addCourseForm) elements.addCourseForm.addEventListener("submit", handleCourseSubmit);
    if (elements.addClassForm) elements.addClassForm.addEventListener("submit", handleClassSubmit);
    if (elements.categoryFilter) elements.categoryFilter.addEventListener("change", applyFilters);
    if (elements.statusFilter) elements.statusFilter.addEventListener("change", applyFilters);

    // Call loadCategories here so it's only called once
    loadCategories();
  }

  function applyFilters() {
    if (!elements.categoryFilter || !elements.statusFilter) return;
    
    const selectedCategory = elements.categoryFilter.value.toLowerCase();
    const selectedStatus = elements.statusFilter.value.toLowerCase();

    let filteredCourses = [...courses];
    
    if(selectedCategory !== "all") {
      filteredCourses = filteredCourses.filter(course => 
        course.category.toLowerCase().includes(selectedCategory));
    }
    
    if(selectedStatus !== "all") {
      filteredCourses = filteredCourses.filter(course => 
        course.status.toLowerCase().includes(selectedStatus));
    }

    updateCourseTables(filteredCourses, classes);
  }

  async function handleCourseSubmit(e) {
    e.preventDefault();
    let prerequisites = [];
    if(document.querySelector("#prerequisites").value){
      prerequisites = (document.querySelector("#prerequisites").value).split(",").map((prerequisite) => prerequisite.trim());
    }
    const formData = {
      id: document.querySelector("#course-id").value,
      name: document.querySelector("#course-name").value,
      credit_hours: document.querySelector("#credit-hours").value,
      category: (document.querySelector("#course-category").value).charAt(0).toUpperCase()+document.querySelector("#course-category").value.slice(1),
      prerequisites: prerequisites || [],
      campus: (document.querySelector("#course-campus").value).charAt(0).toUpperCase()+document.querySelector("#course-campus").value.slice(1),
      status: "Pending",
    };

    try {
      await dh.addCourse(formData);
      elements.addCourseForm.reset();
      closeModal(elements.addCourseModal);
      
      // Refresh data and update UI
      await refreshData();
      showNotification("Course added successfully", "success");
    } catch (error) {
      console.error("Error adding course:", error);
      showNotification("Failed to add course: " + error.message, "error");
    }
  }

  async function handleClassSubmit(e) {
    e.preventDefault();

    const selectedDays = Array.from(document.querySelectorAll('input[name="days"]:checked')).map((checkbox) => checkbox.value);

    if (selectedDays.length === 0) {
      showNotification("Please select at least one day", "error");
      return;
    }
    
    const instructorSelect = document.getElementById("instructor");
    const instructor = users.find(user => user.id === parseInt(instructorSelect.value));
    const courseId = elements.addClassForm.getAttribute("data-course-id");

    const formData = {
      course_id: courseId,
      instructor: parseInt(instructorSelect.value),
      crn: document.getElementById("class-crn").value,
      class_limit: Number(document.getElementById("class-limit").value),
      schedule: formatSchedule(
        selectedDays,
        document.getElementById("start-time").value,
        document.getElementById("end-time").value
      ),
      students: []
    };

    instructor.assigned_classes.push(formData.crn);
    try {
      await dh.addClass(formData);
      await dh.updateUser(instructor.id, instructor);

      elements.addClassForm.reset();
      closeModal(elements.addClassModal);
      
      // Refresh data and update UI
      await refreshData();
      showNotification("Class added successfully", "success");
    } catch (error) {
      console.error("Error adding class:", error);
      showNotification("Failed to add class: " + error.message, "error");
    }
  }

  function attachDynamicEventListeners() {
    // Add Class button event listeners
    document.querySelectorAll(".add-class-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const courseCard = this.closest(".course-card");
        const courseId = courseCard.getAttribute("data-course-id");
        const course = courses.find((course) => course.id === courseId);
        if(course.status === "Closed"){
          showNotification("Cannot add class to a closed course", "error");
          return;
        }
        if (elements.addClassForm) {
          elements.addClassForm.setAttribute("data-course-id", courseId);
          loadInstructors();
          openModal(elements.addClassModal);
        }
      });
    });

    // Validate button event listeners
    document.querySelectorAll(".validate-btn:not([disabled])").forEach((btn) => {
      btn.addEventListener("click", function () {
        updateClassStatus(this, "active");
      });
    });

    // Cancel button event listeners
    document.querySelectorAll(".cancel-btn:not([disabled])").forEach((btn) => {
      btn.addEventListener("click", function () {
        updateClassStatus(this, "closed");
      });
    });
  }

  async function updateClassStatus(button, newStatus) {
    const classCard = button.closest(".class-card");
    const classId = classCard.getAttribute("data-class-id");
    
    try {
      const cls = classes.find((cls) => cls.crn === classId);
      if (!cls) {
        throw new Error("Class not found");
      }
      cls.status = newStatus;
      await dh.updateClass(classId, cls);
      
      // Update students' course status if needed
      let students = users.filter(user => user.userType === "student");
      await Promise.all(
        students.map(async (student) => {
          let updated = false;
          for (const course of student.courses || []) {
            if (course.course_id === cls.course_id && course.status === "pending") {
              course.status = "current";
              updated = true;
            }
          }
          if (updated) {
            await dh.updateUser(student.id, student);
          }
        })
      );
      
      // Refresh data and update UI
      await refreshData();
      showNotification(`Class ${newStatus.toLowerCase()} successfully`, "success");
    } 
    catch (error) {
      console.error(`Error updating class status to ${newStatus}:`, error);
      showNotification(`Failed to update class: ${error.message}`, "error");
    }
  }
});

function formatSchedule(days, startTime, endTime) {
  const dayMap = { sun: "S", mon: "M", tue: "T", wed: "W", thu: "TH"};
  const formattedDays = days.map((day) => dayMap[day]).join("/");

  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(":");
    return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
  };
  
  return `${formattedDays} ${formatTime(startTime)}-${formatTime(endTime)}`;
}

function showNotification(message, type = "info") {
  let notificationContainer = document.querySelector(".notification-container");
  if (!notificationContainer) {
    notificationContainer = document.createElement("div");
    notificationContainer.className = "notification-container";
    document.body.appendChild(notificationContainer);
  }

  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;

  notificationContainer.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("fade-out");
    setTimeout(() => {
      notification.remove();
      if (notificationContainer.children.length === 0) notificationContainer.remove();
    }, 300);
  }, 3000);
}

async function loadCoursesAndClasses() {
  try {
    const classes = await dh.fetchClasses();
    const courses = await dh.fetchCourses();

    return { classes, courses };
  } catch (error) {
    console.error("Error loading courses and classes:", error);
    return { classes: [], courses: [] };
  }
}