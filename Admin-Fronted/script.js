document.addEventListener("DOMContentLoaded", () => {
  const BASE_URL = "http://localhost:3000/api/";

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

  init();

  async function init() {
    await loadCategories();
    loadCoursesAndClasses();
    setupEventListeners();
    fixCheckboxValidation();
  }

  function fixCheckboxValidation() {
    const checkboxes = document.querySelectorAll('input[name="days"]');

    checkboxes.forEach((checkbox) => {
      checkbox.classList.add("day-checkbox");
    });

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

  function populateCategoryDropdowns(categories) {
    if (elements.categoryFilter) {
      const allOption = elements.categoryFilter.querySelector(
        'option[value="all"]'
      );
      elements.categoryFilter.innerHTML = "";
      elements.categoryFilter.appendChild(allOption);

      categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.toLowerCase();
        option.textContent = category;
        elements.categoryFilter.appendChild(option);
      });
    }

    if (elements.courseCategory) {
      const defaultOption =
        elements.courseCategory.querySelector('option[value=""]');
      elements.courseCategory.innerHTML = "";
      elements.courseCategory.appendChild(defaultOption);

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
        option.textContent = instructor.name;
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

    if (elements.statusFilter)
      elements.statusFilter.addEventListener("change", filterCourses);
    if (elements.categoryFilter)
      elements.categoryFilter.addEventListener("change", filterCourses);
  }

  function openModal(modal) {
    if (modal) modal.classList.add("show");
  }

  function closeModal(modal) {
    if (modal) modal.classList.remove("show");
  }

  async function loadCoursesAndClasses() {
    try {
      const response = await fetch(`${BASE_URL}common/`);
      const data = await response.json();
      renderCourses(data.courses);
      showNotification("Courses loaded successfully", "success");
    } catch (error) {
      console.error("Error loading courses and classes:", error);

      elements.coursesContainer.innerHTML = `
        <div class="error-message">
          Unable to load courses. Please try again later.
        </div>
      `;
      showNotification("Failed to load courses", "error");
    }
  }

  function renderCourses(courses) {
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

    attachDynamicEventListeners();
  }

  function renderClasses(classes, courseId) {
    if (!classes || !classes.length) return "";

    return classes
      .map((cls) => {
        const instructorId = cls.instructorDetails?.id || "";

        const isPending = cls.status === "pending";

        const isCancelled = cls.status === "Cancelled";

        const validateDisabled = !isPending ? "disabled" : "";
        const cancelDisabled = !isPending ? "disabled" : "";

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

  function attachDynamicEventListeners() {
    document.querySelectorAll(".add-class-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const courseCard = this.closest(".course-card");
        const courseTitle =
          courseCard.querySelector(".course-title").textContent;
        const courseId = courseCard.getAttribute("data-course-id");

        if (elements.addClassForm) {
          elements.addClassForm.setAttribute("data-course", courseTitle);
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
          updateClassStatus(this, "Started");
        });
      });

    document.querySelectorAll(".cancel-btn:not([disabled])").forEach((btn) => {
      btn.addEventListener("click", function () {
        updateClassStatus(this, "Cancelled");
      });
    });
  }

  async function updateClassStatus(button, newStatus) {
    const classCard = button.closest(".class-card");
    const statusBadge = classCard.querySelector(".class-status-badge");
    const validateBtn = classCard.querySelector(".validate-btn");
    const cancelBtn = classCard.querySelector(".cancel-btn");
    const classId = classCard.getAttribute("data-class-id");

    try {
      let endpoint = "";
      if (newStatus === "Started") {
        endpoint = `${BASE_URL}classes/${classId}/validate`;
      } else if (newStatus === "Cancelled") {
        endpoint = `${BASE_URL}classes/${classId}/cancel`;
      } else {
        throw new Error("Invalid status update requested");
      }

      button.textContent = "Processing...";
      button.disabled = true;

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

      statusBadge.textContent = newStatus;
      statusBadge.className = `badge class-status-badge ${newStatus.toLowerCase()}`;

      validateBtn.disabled = true;
      cancelBtn.disabled = true;

      if (newStatus === "Cancelled") {
        cancelBtn.textContent = "Cancelled";
      }

      updateCourseStatus(classCard.closest(".course-card"), newStatus);

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

  async function handleCourseSubmit(e) {
    e.preventDefault();

    const formData = {
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

      elements.addCourseForm.reset();
      closeModal(elements.addCourseModal);

      loadCoursesAndClasses();

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

      elements.addClassForm.reset();
      closeModal(elements.addClassModal);

      loadCoursesAndClasses();

      showNotification("Class added successfully", "success");
    } catch (error) {
      console.error("Error adding class:", error);
      showNotification("Failed to add class: " + error.message, "error");
    }
  }

  function filterCourses() {
    const statusValue = elements.statusFilter
      ? elements.statusFilter.value
      : "all";
    const categoryValue = elements.categoryFilter
      ? elements.categoryFilter.value
      : "all";

    document.querySelectorAll(".course-card").forEach((card) => {
      let showCard = true;

      if (statusValue !== "all") {
        const statusBadge = card.querySelector(".status-badge");
        if (!statusBadge.classList.contains(statusValue)) {
          showCard = false;
        }
      }

      if (categoryValue !== "all") {
        const categoryText = card
          .querySelector(".category-badge")
          .textContent.toLowerCase();
        if (categoryText !== categoryValue) {
          showCard = false;
        }
      }

      card.style.display = showCard ? "block" : "none";
    });
  }

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
});

console.log("Course management script loaded successfully");
