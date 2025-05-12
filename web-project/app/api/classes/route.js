import * as repo from "@/repo/classes.js";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const instructorId = searchParams.get('instructorId');
    const status = searchParams.get('status');
    const courseId = searchParams.get('course_id');

    if (instructorId) {
      const instructorIdNum = Number(instructorId);
      if (isNaN(instructorIdNum)) {
        return NextResponse.json(
          { error: 'Invalid instructor ID format' },
          { status: 400 }
        );
      }

      const classes = await repo.fetchClassesByInstructorAndStatus(instructorIdNum);
      const filteredClasses = status 
        ? classes.filter(cls => cls.status === status)
        : classes;

      return NextResponse.json(filteredClasses);
    }

    if (courseId) {
      const classes = await repo.getClassesByCourse(courseId); // No need to convert to number if course_id is string
      const filteredClasses = status
        ? classes.filter(cls => cls.status === status)
        : classes;

      return NextResponse.json(filteredClasses);
    }
    const allClasses = await repo.read();
    const filteredClasses = status
      ? allClasses.filter(cls => cls.status === status)
      : allClasses;

    return NextResponse.json(filteredClasses);

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch classes' },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }){
    try{
        let cls;
        try{
            cls = await request.json();
        }
        catch(e){
            return new NextResponse("Invalid request", { status: 400 });
        }
        try{
            cls = await repo.create(cls);
        }
        catch(e){
            return NextResponse.json({ message: "Conflict" }, { status: 409 });
        }
        return NextResponse.json(cls, { status: 201 });
    }
    catch(e){
        console.error(e);
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}