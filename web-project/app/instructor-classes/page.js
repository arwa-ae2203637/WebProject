"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "../layout.css";
import "./instructor-dashboard.css";
import * as dh from "../data-handling";

export default function StudentRecords() {
  const [users, setUsers] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loggedUser, setLoggedUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      try {
        // users
        const users = await dh.fetchUsers();
        const currentUser = await dh.getLoggedUser(users);
        setUsers(users);
        setLoggedUser(currentUser);
        dh.updateUserProfile(currentUser);

        // courses
        const courses = await dh.fetchCourses();
        const selectedClass = JSON.parse(localStorage.getItem("selectedClass"));
        setSelectedClass(selectedClass);
        console.log("Selected class from localStorage:", selectedClass);
        const selectedCourse = await dh.fetchCourseById(selectedClass.course_id);
        setSelectedCourse(selectedCourse);
        console.log("Selected class:", selectedClass);
        console.log("Selected course:", selectedCourse);

        setCourses(courses);

        const allEnrollments = await dh.fetchEnrollments();
        setEnrollments(allEnrollments);
        console.log("All enrollments:", allEnrollments);

        let students = await dh.fetchStudentsByClassCrn(selectedClass.crn);


        console.log("Filtered students:", students);
        setStudents(students);
      } catch (error) {
        console.error("Error loading courses, users or enrollments:", error);
      }
    }

    loadData();
  }, []);

  const handleBackClick = () => {
    router.push("./instructor-dashboard");
  };

  const handleGradeChange = async (student, newGrade, initialGrade) => {
    if (newGrade === initialGrade) {
      return;
    }

    if (confirm(`Change grade from ${initialGrade} to ${newGrade}?`)) {
      try {
        setIsUpdating(true);
         //---
        const enrollmentToUpdate = student.enrollments.find(
          (e) => e.crn === selectedClass.crn
        );
        // const enrollmentToUpdate = await dh.fetchEnrollmentsByStudentAndCrn(
        //   student.id,
        //   selectedClass.crn
        // );
        console.log("Enrollment to update:", enrollmentToUpdate);
        if (!enrollmentToUpdate || !enrollmentToUpdate.id) {
          throw new Error("Enrollment record not found");
        }

        const updatedEnrollment = {
          ...enrollmentToUpdate,
          grade: newGrade,
          status: "completed",
        };

        console.log("Enrollment ID:", enrollmentToUpdate.id);
        console.log("Updated enrollment:", updatedEnrollment);

        await dh.updateEnrollment(
          parseInt(enrollmentToUpdate.id, 10),
          updatedEnrollment
        );

        setStudents((prevStudents) =>
          prevStudents.map((s) => {
            if (s.id === student.id) {
              const updatedStudent = { ...s };
              updatedStudent.enrollments = updatedStudent.enrollments.map((e) =>
                e.crn === selectedClass.crn ? updatedEnrollment : e
              );
              return updatedStudent;
            }
            return s;
          })
        );

        console.log(
          `Grade updated from ${initialGrade} to ${newGrade} for student ${student.id}, enrollment ${enrollmentToUpdate.id}`
        );
      } catch (error) {
        console.error("Error updating grade:", error);
        alert("Failed to update grade: " + error.message);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  return (
    <>
      <div className="header">
        <div>
          <h2 className="title">Student Records</h2>
          <p>Choose your courses</p>
        </div>

        <div className="user-profile">
          <div className="avatar">US</div>
          <span className="user-name">User Name</span>
          <span className="dropdown-icon">▼</span>
        </div>
      </div>

      {/* Sidebar */}
      <div className="side">
        <div>
          <div className="title">
            <img src="/assets/media/qu-logo.png" alt="logo" />
            <h2>Qatar University Portal</h2>
          </div>
          <div className="space-box"></div>
          <nav>
            <div className="options">
              <img src="/assets/icons/grade-icon.png" alt="Grade icon" />
              <a href="#">Grades</a>
            </div>
            <div className="options">
              <img src="/assets/icons/grade-icon.png" alt="Classes icon" />
              <a href="#">Classes</a>
            </div>
          </nav>
        </div>

        <div className="sidebar-footer">
          <div className="options">
            <img src="/assets/icons/circle-help.svg" alt="Help icon" />
            <a href="#">Help</a>
          </div>
          <div className="options">
            <img src="/assets/icons/phone.svg" alt="Contact icon" />
            <a href="#">Contact us</a>
          </div>
          <div className="options">
            <img src="/assets/icons/log-out.svg" alt="Logout icon" />
            <a href="/login">Log out</a>
          </div>
          <div className="mb-10">.</div>
        </div>
      </div>

      {/* Courses Table */}
      <main>
        <div className="container">
          <div className="course-tittle">
            <button className="back-button" onClick={handleBackClick}>
              ↩
            </button>
            <h2 className="course-name">
              {selectedCourse ? selectedCourse.name : "Loading..."} -{" "}
              {selectedCourse ? selectedClass.crn : "Loading..."}
            </h2>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody className="tableBody">
              {students.length > 0 ? (
                students.map((student) => {
                  //----------
                  const enrollment = student.enrollments.find(
                    (e) => e.crn === selectedClass?.crn
                  );
                  const currentGrade = enrollment?.grade || "N/A";

                  return (
                    <tr
                      key={student.id}
                      data-student-id={student.id}
                      data-crn={selectedClass?.crn}
                    >
                      <td>{student.firstName}</td>
                      <td>{student.lastName}</td>
                      <td>{student.username}</td>
                      <td>{enrollment?.status}</td>
                      <td>
                        <select
                          className="grade-dropdown"
                          value={currentGrade}
                          onChange={(e) =>
                            handleGradeChange(
                              student,
                              e.target.value,
                              currentGrade
                            )
                          }
                          disabled={isUpdating}
                        >
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                          <option value="D">D</option>
                          <option value="F">F</option>
                          <option value="N/A">N/A</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="no-students-message">
                    No students enrolled in this class.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pages">
            <button>1</button>
            <button>2</button>
            <button>3</button>
            <button>4</button>
            <button>5</button>
            <button>...</button>
            <button>20</button>
          </div>
        </div>
      </main>
    </>
  );
}


