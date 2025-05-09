"use server";
import * as classes from '@/repo/classes';
import * as dh from "./data-handling.js";
import { revalidatePath } from 'next/cache.js';

export async function getClassByCourse(course_id) {
    return await classes.getClassByCourse(course_id);
  }

  export async function updateCourseStatus(courseId, newStatus) {

    try {
      const course = await dh.fetchCourseById(courseId, "http://localhost:3000");
      if (!course) return { 
        success: false, message: "Course not found" 
      };
      
      course.status = newStatus;
      await dh.updateCourse(courseId, newStatus,"http://localhost:3000");
      
      revalidatePath("/");
      
      return { success: true, message: "Course status updated successfully" };
    } catch (error) {
      console.error("Error changing course status:", error);
      return { success: false, message: error.message };
    }
  }
  
  // Server action to update class status
  export async function updateClassStatus(classId, newStatus) {
    try {
        console.log("Got here: ", classId, newStatus);
      const cls = await dh.fetchClasses(classId);
      console.log(cls);
      if (!cls) {
        throw new Error("Class not found");
      }
      
      cls.status = newStatus;
      await dh.updateClass(classId, cls);
      
      // Handle student status updates if needed
      const users = await dh.fetchUsers();
      const students = users.filter(user => user.userType === "student");
      
      await Promise.all(
        students.map(async (student) => {
          let updated = false;
          for (const course of student.courses || []) {
            if (course.course_id === cls.course_id && course.status === "pending") {
              course.status = "current";
              updated = true;
            }
          }
          if (updated) {
            await dh.updateUser(student.id, student);
          }
        })
      );
      
      revalidatePath("/");

      
      return { success: true, message: `Class ${newStatus.toLowerCase()} successfully` };
    } catch (error) {
      console.error(`Error updating class status to ${newStatus}:`, error);
      return { success: false, message: error.message };
    }
  }
  
  // Server action to add a new course
  export async function addNewCourse(formData) {
    try {
      await dh.addCourse(formData);
      revalidatePath("/");
      return { success: true, message: "Course added successfully" };
    } catch (error) {
      console.error("Error adding course:", error);
      return { success: false, message: error.message };
    }
  }
  
  // Server action to add a new class
  export async function addNewClass(formData, instructorId) {
    try {
      await dh.addClass(formData);
      
      if (instructorId) {
        const instructor = await dh.fetchUsers(instructorId);
        if (instructor) {
          instructor.assigned_classes = instructor.assigned_classes || [];
          instructor.assigned_classes.push(formData.crn);
          await dh.updateUser(instructor.id, instructor);
        }
      }
      
      revalidatePath("/");
      return { success: true, message: "Class added successfully" };
    } catch (error) {
      console.error("Error adding class:", error);
      return { success: false, message: error.message };
    }
  }
   
