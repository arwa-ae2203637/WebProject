import fs from "fs/promises";

export let users = [];
export let courses = [];

export async function saveUsers() {
  try {
    await fs.writeFile("../assets/data/users.json", JSON.stringify(users, null, 2), "utf8");
  } catch (error) {
    console.error("Error saving users file:", error);
    throw error;
  }
}

export async function loadUsers() {
  try {
    const data = await fs.readFile("../assets/data/users.json", "utf8");
    users = JSON.parse(data);
    return users;
  } catch (error) {
    console.error("Error loading users file:", error);
    throw error;
  }
}

export async function saveCourses() {
  try {
    await fs.writeFile("../assets/data/courses.json", JSON.stringify(courses, null, 2), "utf8");
  } catch (error) {
    console.error("Error saving courses file:", error);
    throw error;
  }
}

export async function loadCourses() {
  try {
    const data = await fs.readFile("../assets/data/courses.json", "utf8");
    courses = JSON.parse(data);
    return courses;
  } catch (error) {
    console.error("Error loading courses file:", error);
    throw error;
  }
}

export function toStringUsers() {
  return users.map(user => JSON.stringify(user, null, 2)).join("\n");
}

export function toStringCourses() {
  return courses.map(course => JSON.stringify(course, null, 2)).join("\n");
}
