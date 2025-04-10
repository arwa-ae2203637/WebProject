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
    instructorSelect: document.querySelector("#instructor"),
  };

    const {courses, classes} = await loadCoursesAndClasses();

    updateCourseTables(courses, classes);
    loadCategories();
    setupEventListeners();

function updateCourseTables(courses, classes) {
  if (!elements.coursesContainer) return;

    elements.coursesContainer.innerHTML = "";

    if (!courses || courses.length === 0) {
      elements.coursesContainer.innerHTML = `
      <div class="error-message">
        No courses found. Add a new course to get started.
      </div>
    `;
      return;
    }

    courses.forEach((course) => {
      const courseCard = document.createElement("div");
      courseCard.classList.add("course-card");
      // Add data attribute for course ID
      courseCard.setAttribute("data-course-id", course.id);

      // Determine the status class
      let statusClass = "Pending";
      if (course.status === "Pending") {
        statusClass = "Pending";
      } else if (course.status === "Closed") {
        statusClass = "Closed";
      } else if (course.status === "Active") {
        statusClass = "Active";
      }


      courseCard.innerHTML = `
      <div class="course-header">
      <div class="course-title">${course.name}</div>
      <div class="course-badges">
        <span class="badge category-badge">${course.category}</span>
      </div>
      <span class="badge status-badge ${statusClass.toLowerCase()}">${course.status}</span>
    </div>
    <div class="course-details">
      <p><strong>Credit Hours:</strong> ${course.credit_hours}</p>
      <p><strong>Prerequisites:</strong> ${course.prerequisites.length === 0 ? "None": course.prerequisites}</p>
    </div>
    <div class="expand-section">
      <button class="expand-classes-btn" data-course-id="${course.id}">
        <span class="material-icons">expand_more</span> Show Classes
      </button>
    </div>
    <div class="class-container hidden" id="class-container-${course.id}">
      <h4>Classes</h4>
      <div class="class-cards">
        ${renderClasses(classes, course.id)}
      </div>
      <button class="add-class-btn" data-course-id="${course.id}">
        <span class="material-icons">add</span> Add Class
      </button>
    </div>
  `;

      elements.coursesContainer.appendChild(courseCard);
    });
    attachExpandListeners();
    attachDynamicEventListeners();
  
  }
  function renderClasses(classes, courseId) {
    let courseClasses = [];
    if(classes != null && classes.length > 0){
       courseClasses = classes.filter((cls) => cls.course_id === courseId);

    }

    if(!courseClasses || courseClasses.length === 0) {
      return `
        <div class="error-message">
          No classes found for this course. Add a new class to get started.
        </div>
      `;
    }

    return courseClasses
      .map((cls) => {
        const instructorId = cls.instructorDetails?.id || "";
        console.log(cls.status);
        const isPending = cls.status === "active";

        const isCancelled = cls.status === "closed";

        const validateDisabled = !isPending ?  "" : "disabled";
        const cancelDisabled = !isCancelled ?  "" : "disabled";

        console.log(validateDisabled);
        console.log(cancelDisabled);
        const cancelBtnText = isCancelled ? "Cancelled" : "Cancel";

        return `
        <div class="class-card" data-class-id="${
          cls.crn
        }" data-course-id="${courseId}" data-instructor-id="${instructorId}">
        <div class="class-header">
          <span class="crn">CRN: ${cls.crn}</span>
          <span class="badge class-status-badge ${cls.status.toLowerCase()}">${
          cls.status
        }</span>
        </div>
        <div class="class-details">
          <p><strong>Instructor:</strong> ${cls.instructor}</p>
          <p><strong>Limit:</strong> ${cls.class_limit} students</p>
          <p><strong>Schedule:</strong> ${cls.schedule}</p>
        </div>
        <div class="class-actions">
          <button class="validate-btn" ${validateDisabled}>Validate</button>
          <button class="cancel-btn" ${cancelDisabled}>
            ${cancelBtnText}
          </button>
        </div>
      </div>
    `;
      })
      .join("");
  }

  function attachExpandListeners() {
    document.querySelectorAll('.expand-classes-btn').forEach(button => {
      button.addEventListener('click', function() {
        const courseId = this.getAttribute('data-course-id');
        const classContainer = document.getElementById(`class-container-${courseId}`);
        
        // Toggle class container visibility just for this course
        classContainer.classList.toggle('hidden');
        
        // Update button text and icon based on current state
        if (classContainer.classList.contains('hidden')) {
          this.innerHTML = '<span class="material-icons">expand_more</span> Show Classes';
        } else {
          this.innerHTML = '<span class="material-icons">expand_less</span> Hide Classes';
        }
      });
    });
    
  }


  function openModal(modal) {
    if (modal) modal.classList.add("show");
  }

  function closeModal(modal) {
    if (modal) modal.classList.remove("show");
  }

  function fixCheckboxValidation() {
    const checkboxes = document.querySelectorAll('input[name="days"]');

    checkboxes.forEach((checkbox) => {
      checkbox.classList.add("day-checkbox");
    });s

    if (checkboxes.length > 0) {
      checkboxes[0].removeAttribute("required");
    }

    const form = document.getElementById("add-class-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        const checked = document.querySelectorAll('input[name="days"]:checked');
        if (checked.length === 0) {
          e.preventDefault();
          showNotification("Please select at least one day", "error");

          checkboxes.forEach((checkbox) => {
            checkbox.setAttribute("required", "required");
          });
        }
      });

      checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
          const anyChecked = Array.from(checkboxes).some((cb) => cb.checked);
          checkboxes.forEach((cb) => {
            if (anyChecked) {
              cb.removeAttribute("required");
            } else {
              cb.setAttribute("required", "required");
            }
          });
        });
      });
    }
  }

  async function loadCategories() {
    try{
      const cateogriesResponse = await fetch("/assets/categories.json");   
      const categories = await cateogriesResponse.json();
      if(categories){
        populateCategoryDropdowns(categories);
      }
    }
    catch (error) {
        console.error("Error loading categories:", error);
        showNotification("Failed to load categories: " + error.message, "error");
      }
  }

  function populateCategoryDropdowns(categories) {
      if (elements.categoryFilter) {
        // Save the "All" option if it exists
        const allOption = elements.categoryFilter.querySelector('option[value="all"]');
        elements.categoryFilter.innerHTML = "";
        // Re-add the "All" option if it existed
        if (allOption) elements.categoryFilter.appendChild(allOption);
    
        categories.forEach((category) => {
          const option = document.createElement("option");
          option.value = category.toLowerCase();
          option.textContent = category;
          elements.categoryFilter.appendChild(option);
        });
      }
    
      if (elements.courseCategory) {
        // Save the default empty option if it exists
        const defaultOption = elements.courseCategory.querySelector('option[value=""]');
        elements.courseCategory.innerHTML = "";
        // Re-add the default option if it existed
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
      const users = await dh.fetchUsers();
      const instructors = users.filter(user => user.userType === "instructor");
      if (instructors) {
        populateInstructorDropdown(instructors);
      } else {
        console.error("Invalid instructors data format:");
        showNotification("Failed to load instructors", "error");
      }
    } catch (error) {
      console.error("Error loading instructors:", error);
      showNotification("Failed to load instructors: " + error.message, "error");
    }
  }

  function populateInstructorDropdown(instructors) {

    if (elements.instructorSelect) {
      // Keep the default "Select an instructor" option
      const defaultOption =
        elements.instructorSelect.querySelector('option[value=""]');
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


    // Modal controls
    if (elements.addCourseBtn) {
      elements.addCourseBtn.addEventListener("click", () =>
        openModal(elements.addCourseModal)
      );
    }

    document
      .querySelectorAll(".close-modal, .cancel-form-btn")
      .forEach((btn) => {
        btn.addEventListener("click", () => closeModal(btn.closest(".modal")));
      });

    window.addEventListener("click", (event) => {
      if (event.target === elements.addCourseModal)
        closeModal(elements.addCourseModal);
      if (event.target === elements.addClassModal)
        closeModal(elements.addClassModal);
    });

    if (elements.addCourseForm) {
      elements.addCourseForm.addEventListener("submit", handleCourseSubmit);
    }

    if (elements.addClassForm) {
      elements.addClassForm.addEventListener("submit", handleClassSubmit);
    }

    elements.categoryFilter.addEventListener("change", () => {
      filter( elements.categoryFilter, elements.statusFilter);
    });
    elements.statusFilter.addEventListener("change", () => {
      filter( elements.categoryFilter, elements.statusFilter);  
    });

  }

  function filter(category,status){
    const selectedCategory = category.value.toLowerCase();
    const selectedStatus = status.value.toLowerCase();

    let filteredCourses = [...courses];
    if(selectedCategory === "all" && selectedStatus === "all"){
      filteredCourses = [...courses];
    }
    else if(selectedCategory === "all"){
      filteredCourses = courses.filter(course => course.status.toLowerCase().includes(selectedStatus));
    }
    else if(selectedStatus === "all"){
      filteredCourses = courses.filter(course => course.category.toLowerCase().includes(selectedCategory));
    }
    else if(selectedCategory !== "all" && selectedStatus !== "all"){
      filteredCourses = courses.filter(course => course.category.toLowerCase().includes(selectedCategory) && course.status.toLowerCase().includes(selectedStatus));
    }

    updateCourseTables( filteredCourses,classes);
  }

  async function handleCourseSubmit(e) {
    e.preventDefault();

    const formData = {
      id: document.querySelector("#course-id").value,
      name: document.querySelector("#course-name").value,
      credit_hours: document.querySelector("#credit-hours").value,
      category: (document.querySelector("#course-category").value).charAt(0).toUpperCase()+document.querySelector("#course-category").value.slice(1),
      prerequisites: document.querySelector("#prerequisites").value || "None",
      campus:(document.querySelector("#course-campus").value).charAt(0).toUpperCase()+document.querySelector("#course-campus").value.slice(1),
      status: "Pending",
    };

    try {

      await dh.addCourse(formData);

      elements.addCourseForm.reset();
      closeModal(elements.addCourseModal);
      const {courses, classes} = await loadCoursesAndClasses();
      updateCourseTables( courses,classes);

      showNotification("Course added successfully", "success");
    } catch (error) {
      console.error("Error adding course:", error);
      showNotification("Failed to add course: " + error.message, "error");
    }
  }

  async function handleClassSubmit(e) {
    e.preventDefault();

    const selectedDays = Array.from(
      document.querySelectorAll('input[name="days"]:checked')
    ).map((checkbox) => checkbox.value);

    if (selectedDays.length === 0) {
      showNotification("Please select at least one day", "error");
      return;
    }

    const instructorSelect = document.getElementById("instructor");
    const courseId = elements.addClassForm.getAttribute("data-course-id");

    const formData = {
      course_id: courseId,
      instructor: parseInt(instructorSelect.value),
      crn: document.getElementById("class-crn").value,
      class_limit: document.getElementById("class-limit").value,
      schedule: formatSchedule(
        selectedDays,
        document.getElementById("start-time").value,
        document.getElementById("end-time").value
      ),
      students: []
    };



    try {

      await dh.addClass(formData);

      elements.addClassForm.reset();
      closeModal(elements.addClassModal);
      const {courses, classes} = await loadCoursesAndClasses();
      updateCourseTables(courses,classes);

      showNotification("Class added successfully", "success");
    } catch (error) {
      console.error("Error adding class:", error);
      showNotification("Failed to add class: " + error.message, "error");
    }
  }
  function attachDynamicEventListeners() {

    // Add event listeners for "Add Class" buttons
// document.querySelectorAll('.add-class-btn').forEach(button => {
//   button.addEventListener('click', function() {
//     const courseId = this.getAttribute('data-course-id');
    
//     openModal(elements.addClassModal);
//   });
// });

document.querySelectorAll(".add-class-btn").forEach((btn) => {
btn.addEventListener("click", function () {
  const courseCard = this.closest(".course-card");
  // const courseTitle = courseCard.querySelector(".course-title").textContent;
  const courseId = courseCard.getAttribute("data-course-id");

  if (elements.addClassForm) {
    // elements.addClassForm.setAttribute("data-course", courseTitle);
    elements.addClassForm.setAttribute("data-course-id", courseId);
    loadInstructors();
    openModal(elements.addClassModal);
  }
});
});

document
  .querySelectorAll(".validate-btn:not([disabled])")
  .forEach((btn) => {
    btn.addEventListener("click", function () {
      updateClassStatus(this, "active");
    });
  });

document.querySelectorAll(".cancel-btn:not([disabled])").forEach((btn) => {
  btn.addEventListener("click", function () {
    updateClassStatus(this, "closed");
  });
});
}

async function updateClassStatus(button, newStatus) {
  const classCard = button.closest(".class-card");
  const statusBadge = classCard.querySelector(".class-status-badge");
  const validateBtn = classCard.querySelector(".validate-btn");
  const cancelBtn = classCard.querySelector(".cancel-btn");
  const classId = classCard.getAttribute("data-class-id");
  console.log(classes);
  console.log(classId);
  const cls = classes.find((cls) => cls.crn === classId);
  try {
    console.log(cls);
    cls.status = newStatus;
    await dh.updateClass(classId, cls);

    statusBadge.textContent = newStatus;
    statusBadge.className = `badge class-status-badge ${newStatus.toLowerCase()}`;
    console.log("New status: ", newStatus);
    if(newStatus === "active"){
      validateBtn.disabled = true;
      cancelBtn.disabled = false;
    }
    else{
      cancelBtn.disabled = true;
      validateBtn.disabled = false;
    }
    if (newStatus === "closed") {
      cancelBtn.textContent = "Closed";
    }


    showNotification(
      `Class ${newStatus.toLowerCase()} successfully`,
      "success"
    );
  } catch (error) {
    console.error(`Error updating class status to ${newStatus}:`, error);

    button.disabled = false;
    if (newStatus === "Started") {
      button.textContent = "Validate";
    } else {
      button.textContent = "Cancel";
    }

    showNotification(`Failed to update class: ${error.message}`, "error");
  }
}


});


function formatSchedule(days, startTime, endTime) {
  const dayMap = { sun: "S", mon: "M", tue: "T", wed: "W", thu: "TH"};

  const formattedDays = days.map((day) => dayMap[day]).join("/");

  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(":");
    const hour = Number.parseInt(hours);
    const minute = Number.parseInt(minutes);
    return `${hour}:${minute}`;
  };

  return `${formattedDays} ${formatTime(startTime)}-${formatTime(endTime)}`;
}


function updateBadge(badge, text, className) {
  badge.textContent = text;
  badge.className = `badge status-badge ${className}`;
}

function showNotification(message, type = "info") {
  let notificationContainer = document.querySelector(
    ".notification-container"
  );
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

      if (notificationContainer.children.length === 0) {
        notificationContainer.remove();
      }
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
  }
}