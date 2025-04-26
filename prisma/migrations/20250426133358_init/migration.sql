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
    "crn" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "course_id" TEXT NOT NULL,
    "instructorId" INTEGER NOT NULL,
    "class_limit" INTEGER NOT NULL,
    "schedule" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    CONSTRAINT "Class_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Class_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Enrollment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "studentId" INTEGER NOT NULL,
    "classCrn" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    CONSTRAINT "Enrollment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Enrollment_classCrn_fkey" FOREIGN KEY ("classCrn") REFERENCES "Class" ("crn") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
