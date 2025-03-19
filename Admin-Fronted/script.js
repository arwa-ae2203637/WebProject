document.addEventListener("DOMContentLoaded", () => {
  // Constants
  const BASE_URL = "http://localhost:3000/api/";

  // DOM Elements
  const elements = {
    coursesContainer: document.querySelector(".courses-container"),
    addCourseBtn: document.getElementById("add-course-btn"),
    addCourseModal: document.getElementById("add-course-modal"),
    addClassModal: document.getElementById("add-class-modal"),
    addCourseForm: document.getElementById("add-course-form"),
    addClassForm: document.getElementById("add-class-form"),
    statusFilter: document.getElementById("status-filter"),
    categoryFilter: document.getElementById("category-filter"),
    courseCategory: document.getElementById("course-category"),
    instructorSelect: document.getElementById("instructor"),
  };

  // Initialize the application
  init();

  async function init() {
    await loadCategories(); // Load categories first
    loadCoursesAndClasses();
    setupEventListeners();
    fixCheckboxValidation();
  }

  // Fix checkbox validation to require any checkbox, not just Monday
  function fixCheckboxValidation() {
    const checkboxes = document.querySelectorAll('input[name="days"]');

    // Add class for styling
    checkboxes.forEach((checkbox) => {
      checkbox.classList.add("day-checkbox");
    });

    // Remove the 'required' attribute from Monday checkbox
    if (checkboxes.length > 0) {
      checkboxes[0].removeAttribute("required");
    }

    // Add a custom validation
    const form = document.getElementById("add-class-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        const checked = document.querySelectorAll('input[name="days"]:checked');
        if (checked.length === 0) {
          e.preventDefault();
          showNotification("Please select at least one day", "error");

          // Add visual indication
          checkboxes.forEach((checkbox) => {
            checkbox.setAttribute("required", "required");
          });
        }
      });

      // Remove required attribute when any checkbox is checked
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

  // Load categories from API
  async function loadCategories() {
    try {
      const response = await fetch(`${BASE_URL}courses/getAllCategories`);
      const data = await response.json();

      if (data.categories && Array.isArray(data.categories)) {
        populateCategoryDropdowns(data.categories);
      } else {
        console.error("Invalid categories data format:", data);
        showNotification("Failed to load categories", "error");
      }
    } catch (error) {
      console.error("Error loading categories:", error);
      showNotification("Failed to load categories: " + error.message, "error");
    }
  }

  // Populate category dropdowns with data from API
  function populateCategoryDropdowns(categories) {
    // Populate filter dropdown
    if (elements.categoryFilter) {
      // Keep the "All" option
      const allOption = elements.categoryFilter.querySelector(
        'option[value="all"]'
      );
      elements.categoryFilter.innerHTML = "";
      elements.categoryFilter.appendChild(allOption);

      // Add categories from API
      categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.toLowerCase();
        option.textContent = category;
        elements.categoryFilter.appendChild(option);
      });
    }

    // Populate course form dropdown
    if (elements.courseCategory) {
      // Keep the default "Select a category" option
      const defaultOption =
        elements.courseCategory.querySelector('option[value=""]');
      elements.courseCategory.innerHTML = "";
      elements.courseCategory.appendChild(defaultOption);

      // Add categories from API
      categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.toLowerCase();
        option.textContent = category;
        elements.courseCategory.appendChild(option);
      });
    }
  }

  // Load instructors from API
  async function loadInstructors() {
    try {
      const response = await fetch(`${BASE_URL}instructors/`);
      const data = await response.json();

      if (data.success && data.data && Array.isArray(data.data)) {
        populateInstructorDropdown(data.data);
      } else {
        console.error("Invalid instructors data format:", data);
        showNotification("Failed to load instructors", "error");
      }
    } catch (error) {
      console.error("Error loading instructors:", error);
      showNotification("Failed to load instructors: " + error.message, "error");
    }
  }

  // Populate instructor dropdown with data from API
  function populateInstructorDropdown(instructors) {
    if (elements.instructorSelect) {
      // Keep the default "Select an instructor" option
      const defaultOption =
        elements.instructorSelect.querySelector('option[value=""]');
      elements.instructorSelect.innerHTML = "";
      elements.instructorSelect.appendChild(defaultOption);

      // Add instructors from API
      instructors.forEach((instructor) => {
        const option = document.createElement("option");
        option.value = instructor.id;
        option.textContent = instructor.name;
        elements.instructorSelect.appendChild(option);
      });
    }
  }

  // Setup all static event listeners
  function setupEventListeners() {
    // Modal controls
    if (elements.addCourseBtn) {
      elements.addCourseBtn.addEventListener("click", () =>
        openModal(elements.addCourseModal)
      );
    }

    // Close buttons
    document
      .querySelectorAll(".close-modal, .cancel-form-btn")
      .forEach((btn) => {
        btn.addEventListener("click", () => closeModal(btn.closest(".modal")));
      });

    // Close on outside click
    window.addEventListener("click", (event) => {
      if (event.target === elements.addCourseModal)
        closeModal(elements.addCourseModal);
      if (event.target === elements.addClassModal)
        closeModal(elements.addClassModal);
    });

    // Form submissions
    if (elements.addCourseForm) {
      elements.addCourseForm.addEventListener("submit", handleCourseSubmit);
    }

    if (elements.addClassForm) {
      elements.addClassForm.addEventListener("submit", handleClassSubmit);
    }

    // Filters
    if (elements.statusFilter)
      elements.statusFilter.addEventListener("change", filterCourses);
    if (elements.categoryFilter)
      elements.categoryFilter.addEventListener("change", filterCourses);
  }

  // Helper functions for modals
  function openModal(modal) {
    if (modal) modal.classList.add("show");
  }

  function closeModal(modal) {
    if (modal) modal.classList.remove("show");
  }

  // Load data from API
  async function loadCoursesAndClasses() {
    try {
      const response = await fetch(`${BASE_URL}common/`);
      const data = await response.json();
      renderCourses(data.courses);
      showNotification("Courses loaded successfully", "success");
    } catch (error) {
      console.error("Error loading courses and classes:", error);
      // Show user-friendly error message
      elements.coursesContainer.innerHTML = `
        <div class="error-message">
          Unable to load courses. Please try again later.
        </div>
      `;
      showNotification("Failed to load courses", "error");
    }
  }

  // Render courses
  function renderCourses(courses) {
    if (!elements.coursesContainer) return;

    elements.coursesContainer.innerHTML = ""; // Clear existing content

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
      let statusClass = "pending";
      if (course.status === "In Progress") {
        statusClass = "in-progress";
      } else if (course.status === "Cancelled") {
        statusClass = "cancelled";
      } else if (course.status === "Started") {
        statusClass = "started";
      }

      courseCard.innerHTML = `
    <div class="course-header">
      <div class="course-title">${course.name}</div>
      <div class="course-badges">
        <span class="badge category-badge">${course.category}</span>
      </div>
      <span class="badge status-badge ${statusClass.toLowerCase()}">${
        course.status
      }</span>
    </div>
    <div class="course-details">
      <p><strong>Credit Hours:</strong> ${course.creditHours}</p>
      <p><strong>Prerequisites:</strong> ${course.prerequisites || "None"}</p>
    </div>
    <div class="class-container">
      <h4>Classes</h4>
      <div class="class-cards">
        ${renderClasses(course.classes, course.id)}
      </div>
      <button class="add-class-btn">
        <span class="material-icons">add</span> Add Class
      </button>
    </div>
  `;

      elements.coursesContainer.appendChild(courseCard);
    });

    // Attach event listeners to dynamic elements
    attachDynamicEventListeners();
  }

  // Render classes
  function renderClasses(classes, courseId) {
    if (!classes || !classes.length) return "";

    return classes
      .map((cls) => {
        // Get instructor ID from instructorDetails if available
        const instructorId = cls.instructorDetails?.id || "";

        // Determine button states based on class status
        const isPending = cls.status === "pending";
        const isStarted = cls.status === "Started";
        const isCancelled = cls.status === "Cancelled";

        // Set disabled attributes for buttons - disable both buttons if not pending
        const validateDisabled = !isPending ? "disabled" : "";
        const cancelDisabled = !isPending ? "disabled" : "";

        // Set button text
        const cancelBtnText = isCancelled ? "Cancelled" : "Cancel";

        return `
        <div class="class-card" data-class-id="${
          cls.id
        }" data-course-id="${courseId}" data-instructor-id="${instructorId}">
        <div class="class-header">
          <span class="crn">CRN: ${cls.crn}</span>
          <span class="badge class-status-badge ${cls.status.toLowerCase()}">${
          cls.status
        }</span>
        </div>
        <div class="class-details">
          <p><strong>Instructor:</strong> ${cls.instructorDetails.name}</p>
          <p><strong>Limit:</strong> ${cls.classLimit} students</p>
          <p><strong>Enrolled:</strong> ${cls.enrolled} students</p>
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

  // Attach event listeners to dynamically created elements
  function attachDynamicEventListeners() {
    // Add Class buttons
    document.querySelectorAll(".add-class-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const courseCard = this.closest(".course-card");
        const courseTitle =
          courseCard.querySelector(".course-title").textContent;
        const courseId = courseCard.getAttribute("data-course-id");

        if (elements.addClassForm) {
          elements.addClassForm.setAttribute("data-course", courseTitle);
          elements.addClassForm.setAttribute("data-course-id", courseId);
          // Load instructors when opening the add class modal
          loadInstructors();
          openModal(elements.addClassModal);
        }
      });
    });

    // Action buttons (validate/cancel)
    document
      .querySelectorAll(".validate-btn:not([disabled])")
      .forEach((btn) => {
        btn.addEventListener("click", function () {
          updateClassStatus(this, "Started");
        });
      });

    document.querySelectorAll(".cancel-btn:not([disabled])").forEach((btn) => {
      btn.addEventListener("click", function () {
        updateClassStatus(this, "Cancelled");
      });
    });
  }

  // Update class status (for validate/cancel buttons)
  async function updateClassStatus(button, newStatus) {
    const classCard = button.closest(".class-card");
    const statusBadge = classCard.querySelector(".class-status-badge");
    const validateBtn = classCard.querySelector(".validate-btn");
    const cancelBtn = classCard.querySelector(".cancel-btn");
    const classId = classCard.getAttribute("data-class-id");
    const courseId = classCard.getAttribute("data-course-id");

    try {
      // Determine which API endpoint to call based on the requested status
      let endpoint = "";
      if (newStatus === "Started") {
        endpoint = `${BASE_URL}classes/${classId}/validate`;
      } else if (newStatus === "Cancelled") {
        endpoint = `${BASE_URL}classes/${classId}/cancel`;
      } else {
        throw new Error("Invalid status update requested");
      }

      // Show loading state
      button.textContent = "Processing...";
      button.disabled = true;

      // Make API call to update the status
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update class status");
      }

      const data = await response.json();
      console.log("Status updated on server:", data);

      // Update UI based on the response
      statusBadge.textContent = newStatus;
      statusBadge.className = `badge class-status-badge ${newStatus.toLowerCase()}`;

      // Disable both buttons regardless of which status was updated
      validateBtn.disabled = true;
      cancelBtn.disabled = true;

      // Update button text if cancelled
      if (newStatus === "Cancelled") {
        cancelBtn.textContent = "Cancelled";
      }

      // Update course status if needed
      updateCourseStatus(classCard.closest(".course-card"), newStatus);

      // Show success message
      showNotification(
        `Class ${newStatus.toLowerCase()} successfully`,
        "success"
      );
    } catch (error) {
      console.error(`Error updating class status to ${newStatus}:`, error);

      // Reset button state
      button.disabled = false;
      if (newStatus === "Started") {
        button.textContent = "Validate";
      } else {
        button.textContent = "Cancel";
      }

      // Show error message
      showNotification(`Failed to update class: ${error.message}`, "error");
    }
  }

  // Handle course form submission
  async function handleCourseSubmit(e) {
    e.preventDefault();

    const formData = {
      id: "1", // This would normally be generated by the server
      name: document.getElementById("course-name").value,
      creditHours: document.getElementById("credit-hours").value,
      category: document.getElementById("course-category").value,
      prerequisites: document.getElementById("prerequisites").value || "None",
    };

    try {
      const response = await fetch(`${BASE_URL}courses/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to add course");

      const addedCourse = await response.json();
      console.log("Course added:", addedCourse);

      // Reset and close
      elements.addCourseForm.reset();
      closeModal(elements.addCourseModal);

      // Reload courses to show the new one
      loadCoursesAndClasses();

      // Show success notification
      showNotification("Course added successfully", "success");
    } catch (error) {
      console.error("Error adding course:", error);
      showNotification("Failed to add course: " + error.message, "error");
    }
  }

  // Handle class form submission
  async function handleClassSubmit(e) {
    e.preventDefault();

    // Get selected days
    const selectedDays = Array.from(
      document.querySelectorAll('input[name="days"]:checked')
    ).map((checkbox) => checkbox.value);

    // Check if at least one day is selected
    if (selectedDays.length === 0) {
      showNotification("Please select at least one day", "error");
      return;
    }

    const instructorSelect = document.getElementById("instructor");
    const courseId = elements.addClassForm.getAttribute("data-course-id");

    // Get instructor name from the selected option
    const instructorName =
      instructorSelect.options[instructorSelect.selectedIndex].text;

    const formData = {
      courseId: courseId,
      instructorId: instructorSelect.value,
      crn: document.getElementById("class-crn").value,
      classLimit: document.getElementById("class-limit").value,
      schedule: formatSchedule(
        selectedDays,
        document.getElementById("start-time").value,
        document.getElementById("end-time").value
      ),
    };

    try {
      const response = await fetch(`${BASE_URL}classes/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to add class");

      const addedClass = await response.json();
      console.log("Class added:", addedClass);

      // Reset and close
      elements.addClassForm.reset();
      closeModal(elements.addClassModal);

      // Reload courses to show the new class
      loadCoursesAndClasses();

      // Show success notification
      showNotification("Class added successfully", "success");
    } catch (error) {
      console.error("Error adding class:", error);
      showNotification("Failed to add class: " + error.message, "error");
    }
  }

  // Find course card by ID
  function findCourseCardById(courseId) {
    let found = null;
    document.querySelectorAll(".course-card").forEach((card) => {
      if (card.getAttribute("data-course-id") === courseId) {
        found = card;
      }
    });
    return found;
  }

  // Filter courses
  function filterCourses() {
    const statusValue = elements.statusFilter
      ? elements.statusFilter.value
      : "all";
    const categoryValue = elements.categoryFilter
      ? elements.categoryFilter.value
      : "all";

    document.querySelectorAll(".course-card").forEach((card) => {
      let showCard = true;

      // Status filter
      if (statusValue !== "all") {
        const statusBadge = card.querySelector(".status-badge");
        if (!statusBadge.classList.contains(statusValue)) {
          showCard = false;
        }
      }

      // Category filter
      if (categoryValue !== "all") {
        const categoryText = card
          .querySelector(".category-badge")
          .textContent.toLowerCase();
        if (categoryText !== categoryValue) {
          showCard = false;
        }
      }

      // Show/hide card
      card.style.display = showCard ? "block" : "none";
    });
  }

  // Format schedule
  function formatSchedule(days, startTime, endTime) {
    const dayMap = {
      sun: "Sun",
      mon: "Mon",
      tue: "Tue",
      wed: "Wed",
      thu: "Thu",
    };

    const formattedDays = days.map((day) => dayMap[day]).join(", ");

    const formatTime = (timeStr) => {
      const [hours, minutes] = timeStr.split(":");
      const hour = Number.parseInt(hours);
      const ampm = hour >= 12 ? "PM" : "AM";
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    };

    return `${formattedDays} ${formatTime(startTime)}-${formatTime(endTime)}`;
  }

  // Add new course card
  function addNewCourseCard(name, creditHours, category, prerequisites) {
    const courseCard = document.createElement("div");
    courseCard.className = "course-card";

    courseCard.innerHTML = `
      <div class="course-header">
        <div class="course-title">${name}</div>
        <div class="course-badges">
          <span class="badge category-badge">${
            category.charAt(0).toUpperCase() + category.slice(1)
          }</span>
          <span class="badge status-badge pending">Pending</span>
        </div>
      </div>
      <div class="course-details">
        <p><strong>Credit Hours:</strong> ${creditHours}</p>
        <p><strong>Prerequisites:</strong> ${prerequisites}</p>
      </div>
      <div class="class-container">
        <h4>Classes</h4>
        <div class="class-cards"></div>
        <button class="add-class-btn">
          <span class="material-icons">add</span> Add Class
        </button>
      </div>
    `;

    elements.coursesContainer.appendChild(courseCard);
    attachDynamicEventListeners();
  }

  // Add new class card
  function addNewClassCard(
    courseCard,
    classId,
    crn,
    instructorName,
    instructorId,
    classLimit,
    enrolledCount,
    schedule
  ) {
    const classContainer = courseCard.querySelector(".class-cards");
    const courseId = courseCard.getAttribute("data-course-id");

    const classCard = document.createElement("div");
    classCard.className = "class-card";
    classCard.setAttribute("data-class-id", classId);
    classCard.setAttribute("data-course-id", courseId);
    classCard.setAttribute("data-instructor-id", instructorId);

    classCard.innerHTML = `
  <div class="class-header">
    <span class="crn">CRN: ${crn}</span>
    <span class="badge class-status-badge pending">Pending</span>
  </div>
  <div class="class-details">
    <p><strong>Instructor:</strong> ${instructorName}</p>
    <p><strong>Limit:</strong> ${classLimit} students</p>
    <p><strong>Enrolled:</strong> ${enrolledCount || 0} students</p>
    <p><strong>Schedule:</strong> ${schedule}</p>
  </div>
  <div class="class-actions">
    <button class="validate-btn">Validate</button>
    <button class="cancel-btn">Cancel</button>
  </div>
`;

    // Append to the end of the class cards container
    classContainer.appendChild(classCard);
    attachDynamicEventListeners();
  }

  // Update course status based on its classes
  function updateCourseStatus(courseCard, newStatus) {
    const classCards = courseCard.querySelectorAll(".class-card");
    let hasStartedClass = false;
    let allClassesCancelled = true;

    classCards.forEach((card) => {
      if (newStatus === "Started") {
        hasStartedClass = true;
      }
      if (newStatus !== "Cancelled") {
        allClassesCancelled = false;
      }
    });

    const courseStatusBadge = courseCard.querySelector(".status-badge");

    if (hasStartedClass) {
      updateBadge(courseStatusBadge, "In Progress", "in-progress");
    } else if (allClassesCancelled && classCards.length > 0) {
      updateBadge(courseStatusBadge, "Cancelled", "cancelled");
    }
  }

  // Helper to update badge text and class
  function updateBadge(badge, text, className) {
    badge.textContent = text;
    badge.className = `badge status-badge ${className}`;
  }

  // Add a simple notification function
  function showNotification(message, type = "info") {
    // Check if notification container exists, create if not
    let notificationContainer = document.querySelector(
      ".notification-container"
    );
    if (!notificationContainer) {
      notificationContainer = document.createElement("div");
      notificationContainer.className = "notification-container";
      document.body.appendChild(notificationContainer);
    }

    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Add to container
    notificationContainer.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.add("fade-out");
      setTimeout(() => {
        notification.remove();
        // Remove container if empty
        if (notificationContainer.children.length === 0) {
          notificationContainer.remove();
        }
      }, 300);
    }, 3000);
  }
});

console.log("Course management script loaded successfully");
