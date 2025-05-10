// Base URL for API endpoints
const API_URL_USERS = '/api/users';
const API_URL_COURSES = '/api/courses';
const API_URL_CLASS = '/api/classes';
const API_URL_ENROLLMENTS = '/api/enrollments';

// ==== COURSE MANAGEMENT ====
export async function fetchCourses() {
  try {
    const response = await fetch(API_URL_COURSES);
    if (!response.ok) {
      throw new Error(`Failed to fetch courses: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
}

export async function addCourse(courseData) {
  try {
    const formattedData = {
      ...courseData,
      credit_hours: Number(courseData.credit_hours)
    };
    const response = await fetch(API_URL_COURSES, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to add course: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error adding course:", error);
    throw error;
  }
}

export async function updateCourse(id, courseData) {
  try {
    const response = await fetch(`${API_URL_COURSES}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(courseData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to update course: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error updating course ${id}:`, error);
    throw error;
  }
}

export async function deleteCourse(id) {
  try {
    const response = await fetch(`${API_URL_COURSES}/${id}`, {
      method: 'DELETE',
    });
    
    if (response.ok) {
      console.log("Deleted");
    }
  } catch (error) {
    console.error('Error deleting course:', error);
  }
}

// ==== CLASS MANAGEMENT ====
export async function fetchClasses() {
  try {
    const response = await fetch(API_URL_CLASS);
    if (!response.ok) {
      throw new Error(`Failed to fetch classes: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching classes:", error);
    throw error;
  }
}

export async function addClass(classData) {
  try {
    const formattedData = {
      ...classData,
      class_limit: Number(classData.class_limit)
    };
    console.log(`Adding class with data:`, formattedData);
    const response = await fetch(API_URL_CLASS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to add class: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error adding class:", error);
    throw error;
  }
}

export async function updateClass(id, classData) {
  try {
    const response = await fetch(`${API_URL_CLASS}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(classData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to update class: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error updating class ${id}:`, error);
    throw error;
  }
}

export async function deleteClass(crn) {
  try {
    const response = await fetch(`${API_URL_CLASS}/${crn}`, {
      method: 'DELETE',
    });
    
    if (response.ok) {
      console.log("Deleted");
    }
  } catch (error) {
    console.error('Error deleting task:', error);
  }
}

// ==== USER MANAGEMENT ====
export async function fetchUsers() {
  try {
    const response = await fetch(API_URL_USERS);
    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export async function updateUser(id, userData) {
  try {
    const response = await fetch(`${API_URL_USERS}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to update user: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    throw error;
  }
}

export async function deleteUser(id) {
  try {
    const response = await fetch(`${API_URL_USERS}/${id}`, {
      method: 'DELETE',
    });
    
    if (response.ok) {
      console.log("Deleted");
    }
  } catch (error) {
    console.error('Error deleting user:', error);
  }
}

export function getLoggedUser(users) {
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser") || "null");
  return users?.find(u => u.id === loggedUser?.id);
}

export function updateUserProfile(student) {
  try {
      const avatarElement = document.querySelector(".avatar");
      const userNameElement = document.querySelector(".user-name");
            
      const firstName = student.firstName;
      const lastName = student.lastName;
      
      avatarElement.textContent = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
      userNameElement.textContent = `${firstName} ${lastName.charAt(0)}`.trim();
  } catch(err) {
      console.error("Error updating profile:", err);
  }
}

// ==== ENROLLMENT MANAGEMENT ====
export async function fetchEnrollments() {
  try {
    const response = await fetch(API_URL_ENROLLMENTS);
    let enrollments = await response.json();
    // console.log(courses);
    return enrollments;
  } catch (error) {
    console.error('Error fetching course:', error);
  }
}

export async function addEnrollment(cls) {
  try {
    const response = await fetch(API_URL_ENROLLMENTS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cls),
    });
    
    if (response.status === 201) {
      console.log("Enrollment added");
    } 
    else if (response.status === 409) {
      alert('Enrollment for this crn already exists');
    }
  } catch (error) {
    console.error('Error enrolling', error);
  }
}

export async function updateEnrollment(id, newEnrollment) {
  try {
    const response = await fetch(`${API_URL_ENROLLMENTS}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify( newEnrollment ),
    });
    
    if (response.ok) {
      console.log("OK");
    }
  } catch (error) {
    console.error('Error updating enrollment:', error);
  }
}

export async function deleteEnrollment(id) {
  try {
    const response = await fetch(`${API_URL_ENROLLMENTS}/${id}`, {
      method: 'DELETE',
    });
    
    if (response.ok) {
      console.log("Deleted");
    }
  } catch (error) {
    console.error('Error deleting task:', error);
  }
}
  