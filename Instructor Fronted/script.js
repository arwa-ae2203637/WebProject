document.addEventListener("DOMContentLoaded", () => {
  const API_BASE_URL = "http://localhost:3000/api";

  const INSTRUCTOR_ID = "i4";

  const elements = {
    coursesContainer: document.querySelector(".courses-container"),
    studentListModal: document.getElementById("student-list-modal"),
    studentList: document.getElementById("student-list"),
    classTitle: document.getElementById("class-title"),
    closeModal: document.querySelector(".close-modal"),
    cancelBtn: document.querySelector(".cancel-form-btn"),
    submitBtn: document.querySelector(".submit-form-btn"),
  };

  init();

  async function init() {
    setupEventListeners();
    await loadInstructorCourses();
  }

  function setupEventListeners() {
    if (elements.closeModal) {
      elements.closeModal.addEventListener("click", closeModal);
    }
    if (elements.cancelBtn) {
      elements.cancelBtn.addEventListener("click", closeModal);
    }
    if (elements.submitBtn) {
      elements.submitBtn.addEventListener("click", submitGrades);
    }

    window.addEventListener("click", (event) => {
      if (event.target === elements.studentListModal) {
        closeModal();
      }
    });
  }

  async function loadInstructorCourses() {
    try {
      showLoading();

      const response = await fetch(
        `${API_BASE_URL}/instructors/${INSTRUCTOR_ID}/courses`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to load courses");
      }

      const data = await response.json();

      if (data.success && data.data) {
        renderCourses(data.data);
        hideLoading();
        showNotification("Courses loaded successfully", "success");
      } else {
        throw new Error("Invalid data format received from server");
      }
    } catch (error) {
      console.error("Error loading instructor courses:", error);
      hideLoading();
      showNotification(`Failed to load courses: ${error.message}`, "error");

      if (elements.coursesContainer) {
        elements.coursesContainer.innerHTML = `
          <div class="error-message">
            <p>Unable to load courses. Please try again later.</p>
            <button id="retry-btn" class="retry-btn">Retry</button>
          </div>
        `;

        const retryBtn = document.getElementById("retry-btn");
        if (retryBtn) {
          retryBtn.addEventListener("click", loadInstructorCourses);
        }
      }
    }
  }

  function showLoading() {
    if (elements.coursesContainer) {
      elements.coursesContainer.innerHTML = `
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <p>Loading courses...</p>
        </div>
      `;
    }
  }

  function hideLoading() {
    const loadingContainer = document.querySelector(".loading-container");
    if (loadingContainer) {
      loadingContainer.remove();
    }
  }

  function renderCourses(coursesData) {
    if (!elements.coursesContainer) return;

    elements.coursesContainer.innerHTML = "";

    if (!coursesData || coursesData.length === 0) {
      elements.coursesContainer.innerHTML = `
        <div class="error-message">
          <p>No courses found for this instructor.</p>
        </div>
      `;
      return;
    }

    coursesData.forEach((course) => {
      const courseCard = document.createElement("div");
      courseCard.classList.add("course-card");
      courseCard.setAttribute("data-course-id", course.id);

      const totalEnrollment = course.classes.reduce(
        (sum, cls) => sum + cls.enrolled,
        0
      );

      courseCard.innerHTML = `
        <div class="course-header">
          <div class="course-title">${course.id}: ${course.name}</div>
          <div class="course-subtitle">Credit Hours: ${course.creditHours}</div>
        </div>
        <div class="course-details">
          <p><strong>Total Classes:</strong> ${course.classes.length}</p>
          <p><strong>Total Enrollment:</strong> ${totalEnrollment} students</p>
          <p><strong>Category:</strong> ${course.category}</p>
        </div>
        <div class="classes-container">
          <h4>Classes</h4>
          <div class="class-cards">
            <!-- Class cards will be inserted here -->
          </div>
        </div>
      `;

      elements.coursesContainer.appendChild(courseCard);

      const classCardsContainer = courseCard.querySelector(".class-cards");

      if (course.classes.length === 0) {
        classCardsContainer.innerHTML = `<p class="no-classes">No classes found for this course.</p>`;
        return;
      }

      course.classes.forEach((classItem) => {
        const classCard = document.createElement("div");
        classCard.classList.add("class-card");
        classCard.setAttribute("data-class-id", classItem.id);
        classCard.setAttribute("data-course-id", course.id);

        classCard.innerHTML = `
          <div class="class-header">
            <div class="class-name">CRN: ${classItem.crn}</div>
            <span class="class-status ${classItem.status}">${
          classItem.status === "started" ? "In Progress" : classItem.status
        }</span>
          </div>
          <div class="class-details">
            <p><strong>Schedule:</strong> ${classItem.schedule}</p>
            <p><strong>Enrollment:</strong> ${classItem.enrolled}/${
          classItem.classLimit
        } students</p>
          </div>
          <div class="class-actions">
            <button class="submit-grades-btn" data-class-id="${
              classItem.id
            }" data-course-id="${course.id}">
              <span class="material-icons">grade</span> Submit Grades
            </button>
          </div>
        `;

        classCardsContainer.appendChild(classCard);
      });
    });

    document.querySelectorAll(".submit-grades-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const classId = this.getAttribute("data-class-id");
        const courseId = this.getAttribute("data-course-id");

        const course = coursesData.find((c) => c.id === courseId);
        if (!course) {
          showNotification("Course not found", "error");
          return;
        }

        const classData = course.classes.find((cls) => cls.id === classId);
        if (!classData) {
          showNotification("Class not found", "error");
          return;
        }

        openStudentListModal(course, classData);
      });
    });
  }

  function showNotification(message, type = "success") {
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

  function closeModal() {
    if (elements.studentListModal) {
      elements.studentListModal.classList.remove("show");
    }
  }

  function openStudentListModal(course, classData) {
    if (
      !elements.studentListModal ||
      !elements.studentList ||
      !elements.classTitle
    )
      return;

    elements.classTitle.textContent = `${course.id} (CRN: ${classData.crn})`;

    if (!classData.students || classData.students.length === 0) {
      elements.studentList.innerHTML = `
        <tr>
          <td colspan="3" class="no-students">No students enrolled in this class.</td>
        </tr>
      `;
    } else {
      elements.studentList.innerHTML = "";
      classData.students.forEach((student) => {
        const row = document.createElement("tr");

        const gradeOptions = [
          { value: "", label: "Select Grade" },
          { value: "A+", label: "A+" },
          { value: "A", label: "A" },
          { value: "A-", label: "A-" },
          { value: "B+", label: "B+" },
          { value: "B", label: "B" },
          { value: "B-", label: "B-" },
          { value: "C+", label: "C+" },
          { value: "C", label: "C" },
          { value: "C-", label: "C-" },
          { value: "D+", label: "D+" },
          { value: "D", label: "D" },
          { value: "D-", label: "D-" },
          { value: "F", label: "F" },
        ];

        const gradeDropdown = `
          <select class="grade-select" data-student-id="${student.id}">
            ${gradeOptions
              .map(
                (option) =>
                  `<option value="${option.value}" ${
                    student.grade === option.value ? "selected" : ""
                  }>${option.label}</option>`
              )
              .join("")}
          </select>
        `;

        row.innerHTML = `
          <td>${student.id}</td>
          <td>${student.name}</td>
          <td>${gradeDropdown}</td>
        `;
        elements.studentList.appendChild(row);
      });
    }

    elements.studentListModal.setAttribute("data-class-id", classData.id);
    elements.studentListModal.setAttribute("data-course-id", course.id);

    elements.studentListModal.classList.add("show");
  }

  async function submitGrades() {
    const classId = elements.studentListModal.getAttribute("data-class-id");
    const courseId = elements.studentListModal.getAttribute("data-course-id");

    const gradeSelects = document.querySelectorAll(".grade-select");

    const gradesArray = [];

    gradeSelects.forEach((select) => {
      const studentId = select.getAttribute("data-student-id");
      const grade = select.value;

      if (grade) {
        gradesArray.push({
          studentId: studentId,
          grade: grade,
        });
      }
    });

    if (gradesArray.length === 0) {
      showNotification("No grades were selected", "warning");
      return;
    }

    try {
      elements.submitBtn.disabled = true;
      elements.submitBtn.textContent = "Submitting...";

      const payload = {
        courseId: courseId,
        classId: classId,
        grades: gradesArray,
      };

      console.log("Submitting grades with payload:", payload);

      const response = await fetch(`${API_BASE_URL}/grades/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit grades");
      }

      const data = await response.json();

      showNotification("Grades submitted successfully", "success");

      closeModal();

      await loadInstructorCourses();
    } catch (error) {
      console.error("Error submitting grades:", error);
      showNotification(`Failed to submit grades: ${error.message}`, "error");
    } finally {
      elements.submitBtn.disabled = false;
      elements.submitBtn.textContent = "Submit Grades";
    }
  }
});
