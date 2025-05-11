# Statistics for Student Management System

Below are the 10 meaningful statistics to be displayed on the new Statistics Page. Each is directly related to the data and structure of your current project (students, courses, classes, enrollments, instructors):

1. **Number of users per user type (students, instructors, admins)**
   - Shows how many users exist for each user type in the system.
2. **Number of students per course**
   - Displays the enrollment count for each course.
3. **Number of students per course category (e.g., electives, core)**
   - Groups courses by category and counts enrolled students in each.
4. **Top 3 most enrolled courses**
   - Lists the three courses with the highest number of enrollments.
5. **Courses with the highest failure rate**
   - Shows which courses have the most failing grades (e.g., grade = 'F').
6. **Average grade per course**
   - Calculates the average grade for each course.
7. **Number of students per instructor**
   - Counts how many students are assigned to each instructor (via their classes).
8. **Number of students failing more than 2 courses**
   - Identifies students who have failed more than two courses.
9. **Number of courses per category**
   - Shows how many courses exist in each category (e.g., Core, Elective).
10. **Most improved student (based on progress)**
    - Finds the student with the greatest improvement in grades over time (if grade history is available; otherwise, can be based on before/after averages).

---

> This file will guide the implementation of the statistics page and related backend queries. Each stat will have a corresponding Prisma query and API route.