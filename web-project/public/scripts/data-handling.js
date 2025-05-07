
// import { Course } from "../repo/models/course.js";
// import { Class } from "../repo/models/class.js";
// import { User } from "../repo/models/user.js";

const API_URL_USERS = '/api/users';
const API_URL_COURSES = '/api/courses';
const API_URL_CLASS = '/api/classes';



export async function fetchUsers() {
    try {
      const response = await fetch(API_URL_USERS);
      let users = await response.json();
      return users;
    } catch (error) {
      console.error('Error fetching Users:', error);
    }
  }
  export async function updateUser(id, newUser) {
    try {
      console.log("Update user: ", newUser);
      const response = await fetch(`${API_URL_USERS}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser ),
      });
      
      if (response.ok) {
        console.log("OK");
      }
    } catch (error) {
      console.error('Error updating user:', error);
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
  
        // console.log(student);
        
        avatarElement.textContent = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
        userNameElement.textContent = `${firstName} ${lastName.charAt(0)}`.trim();
    } catch(err) {
        console.error("Error updating profile:", err);
    }
  }


export async function fetchCourses() {
  try {
    const response = await fetch(API_URL_COURSES);
    let courses = await response.json();
    // console.log(courses);
    return courses;
  } catch (error) {
    console.error('Error fetching course:', error);
  }
}

export async function addCourse(course) {
  try {
    const response = await fetch(API_URL_COURSES, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(course),
    });
    
    if (response.status === 201) {
      console.log("Course added");
    } else if (response.status === 409) {
      alert('Task with this title already exists');
    }
  } catch (error) {
    console.error('Error adding course:', error);
  }
}

export async function updateCourse(id, newCourse) {
  try {
    const response = await fetch(`${API_URL_COURSES}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify( newCourse ),
    });
    
    if (response.ok) {
      console.log("OK");
    }
  } catch (error) {
    console.error('Error updating course:', error);
  }
}

// Delete a task
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


export async function fetchClasses() {
  try {
    const response = await fetch(API_URL_CLASS);
    let classses = await response.json();
    return classses;
  } catch (error) {
    console.error('Error fetching classes:', error);
  }
}

export async function addClass(cls) {
  try {
    const response = await fetch(API_URL_CLASS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cls),
    });
    
    if (response.status === 201) {
      console.log("Class added");
    } 
    else if (response.status === 409) {
      alert('Class with this crn already exists');
    }
  } catch (error) {
    console.error('Error adding class:', error);
  }
}

export async function updateClass(crn, newClass) {
  try {
    const response = await fetch(`${API_URL_CLASS}/${crn}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify( newClass ),
    });
    
    if (response.ok) {
      console.log("OK");
    }
  } catch (error) {
    console.error('Error updating class:', error);
  }
}

// Delete a task
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
  