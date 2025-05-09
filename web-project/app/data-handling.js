
// import { Course } from "../repo/models/course.js";
// import { Class } from "../repo/models/class.js";
// import { User } from "../repo/models/user.js";

const API_URL_USERS = '/api/users';
const API_URL_COURSES = '/api/courses';
const API_URL_CLASS = '/api/classes';
const API_URL_ENROLLMENTS = '/api/enrollments';


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

export async function updateCourse(id, newCourse, url) {
  try {
    let response = null;
    if(url){
       response = await fetch(`${url}/${API_URL_COURSES}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify( newCourse ),
      });
    }
    else{
      response  =await fetch(`${API_URL_COURSES}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify( newCourse ),
      });
    }
    if(response){
      let course = await response.json();
      return course;
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

export async function fetchCourseById(id, url){
  try {
    let response = null;
    if(url){
       response = await fetch(`${url}/${API_URL_COURSES}/${id}`);
    }
    else{
      response  = await fetch(`${API_URL_COURSES}/${id}`);
    }
    if(response){
      let course = await response.json();
      return course;
    }
   
    
  } catch (error) {
    console.error('Error fetching course:', error);
  }
}
  
export async function getClassByCourse(course_id) {
  try {
    const classes = prisma.class.findMany({
      where: {
        course_id: id,
      }
    })
    return classes;
    // return [];
  } catch (error) {
    console.error('Error fetching classes:', error);
    return [];
  }
}


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
  