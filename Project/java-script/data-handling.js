import { Course } from "../models/course.js";
import { User } from "../models/user.js";
import { Class } from "../models/class.js";
import { Student } from "../models/student.js";
import { Instructor } from "../models/instructor.js";
import { Admin } from "../models/department-administrator.js";


export async function loadData() {
  const [coursesResponse, usersResponse, classesResponse] = await Promise.all([
    fetch("../assets/data/courses.json"),
    fetch("../assets/data/users.json"),
    fetch("../assets/data/classes.json")
  ]);

  const courses = (await coursesResponse.json()).map(c => Course.fromJSON(c));
  const courseMap = Object.fromEntries(courses.map(c => [c.id, c.toJson()]));

  const classes = (await classesResponse.json()).map(cls => {
    const courseData = courseMap[cls.course_id];
    return Class.fromJSON({ ...courseData, ...cls });
  });

  const users = (await usersResponse.json()).map(u => {
    switch (u.userType?.toLowerCase()) {
      case "student":
        return Student.fromJSON(u);
      case "instructor":
        return Instructor.fromJSON(u);
      case "admin":
        return Admin.fromJSON(u);
      default:
        return User.fromJSON(u);
    }
  });

  return { courses, users, classes };
}


export function getLoggedUser(users) {
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser") || "null");
  return users?.find(u => u.id === loggedUser?.id);
}

export function getSelectedCourse(courses) {
  const selectedCourse = JSON.parse(localStorage.getItem("selectedCourse") || "null");
  return courses.find(c => c.id === selectedCourse?.id);
}

export async function getAllClasses(courseId) {
  const { classes } = await loadData();
  return classes.filter(cls => cls.course_id === courseId);
}

export async function getAllUsers() {
  const { users } = await loadData();
  return users;
}

export async function getAllCourses() {
  const { courses } = await loadData();
  return courses;
}

export function updateUserProfile(student) {
  try {
      const avatarElement = document.querySelector(".avatar");
      const userNameElement = document.querySelector(".user-name");
            
      const firstName = student.firstName;
      const lastName = student.lastName;

      console.log(student);
      
      avatarElement.textContent = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
      userNameElement.textContent = `${firstName} ${lastName.charAt(0)}`.trim();
  } catch(err) {
      console.error("Error updating profile:", err);
  }
}