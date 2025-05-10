-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "userType" TEXT NOT NULL,
    "expertise_area" TEXT,
    "assigned_classes" TEXT
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "credit_hours" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "prerequisites" TEXT,
    "campus" TEXT NOT NULL,
    "status" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Class" (
    "crn" TEXT NOT NULL PRIMARY KEY,
    "course_id" TEXT NOT NULL,
    "instructor_id" INTEGER NOT NULL,
    "class_limit" INTEGER NOT NULL,
    "schedule" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    CONSTRAINT "Class_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Class_instructor_id_fkey" FOREIGN KEY ("instructor_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Enrollment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "student_id" INTEGER NOT NULL,
    "crn" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    CONSTRAINT "Enrollment_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Enrollment_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Enrollment_crn_fkey" FOREIGN KEY ("crn") REFERENCES "Class" ("crn") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
