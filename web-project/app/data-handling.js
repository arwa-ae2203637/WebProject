
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
  if(users?.find(u => u.id === loggedUser?.id) === undefined){
    return loggedUser;
  }
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

      if(!student){
        const user = JSON.parse(localStorage.getIatem("loggedUser"));
        userNameElement.textContent = `${user.firstName} ${user.lastName}`;
      }
  } catch(err) {
      console.error("Error updating profile:", err);
  }
}

// ==== ENROLLMENT MANAGEMENT ====
export async function fetchEnrollments() {
  try {
    const response = await fetch(API_URL_ENROLLMENTS);
    let enrollments = await response.json();
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

// export async function updateEnrollment(id, newEnrollment) {
//   try {
//     const response = await fetch(`${API_URL_ENROLLMENTS}/${id}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify( newEnrollment ),
//     });
    
//     if (response.ok) {
//       console.log("OK");
//     }
//   } catch (error) {
//     console.error('Error updating enrollment:', error);
//   }
// }

export async function updateEnrollment(enrollmentId, enrollmentData) {
  const { id, class: classData, ...cleanedData } = enrollmentData;
  const response = await fetch(`/api/enrollments/${enrollmentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cleanedData), 
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error("Failed to update enrollment: " + error.message);
  }
  return await response.json();
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

export async function fetchClassesByInstructorAndStatus(instructorId, status = null) {  
  try {
    let url = `/api/classes?instructorId=${instructorId}`;
    if (status) url += `&status=${status}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch classes: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Fetch Error:", error);
    throw error;
  }
}

export async function fetchClassByCrn(crn) {
  try {
    const response = await fetch(`/api/classes/${crn}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch class: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching class ${crn}:`, error);
    throw error;
  }
}
 
export async function fetchCourseById(id) {
  try {
    const response = await fetch(`${API_URL_COURSES}/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Course with ID ${id} not found`);
      }
      throw new Error(`Failed to fetch course: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching course ${id}:`, error);
    throw error;
  }
}

export async function fetchStudentsByClassCrn(crn) {
  try {
    if (!crn) {
      console.warn("No CRN provided to fetchStudentsByClassCrn");
      return [];
    }

    const response = await fetch(`${API_URL_USERS}?userType=student&enrollmentCrn=${crn}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch students: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching students for class ${crn}:`, error);
    return []; 
  }
}

export async function fetchEnrollmentsByStudentAndStatus(studentId, status) {
  try {
    const url = `/api/enrollments?studentId=${studentId}&status=${status}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    return [];
  }
}

export async function fetchCoursesByStatus(status) {
  try {
    const url = `/api/courses?status=${status}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching courses by status:', error);
    return []; 
  }
}

export async function searchCoursesByName(searchTerm) {
  try {
    const response = await fetch(`/api/courses/search?q=${encodeURIComponent(searchTerm)}`);
    if (!response.ok) throw new Error('Search failed');

    const data = await response.json();
    return []; 
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}

export async function getClassesByCourse(course_id) {
  try {
    if (!course_id) {
      console.warn("No course_id provided");
      return [];
    }
    const response = await fetch(`/api/classes?course_id=${course_id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching classes for course ${course_id}:`, error);
    return [];
  }
}
