import * as repo from "@/repo/courses.js";
import { NextResponse } from "next/server";

// export async function GET(request) {
//     try {
//       const { searchParams } = new URL(request.url);
//       const status = searchParams.get('status');
//         if (status) {
//         const courses = await repo.fetchCoursesByStatus(status);
        
//         return NextResponse.json(courses, { status: 200 });
//       }
//         const courses = await repo.read();
//       return NextResponse.json(courses, { status: 200 });
  
//     } catch (error) {
//       console.error('Error in courses API:', error);
//       return NextResponse.json({ message: "Error fetching courses" }, { status: 500 });
//     }
//   }


export async function GET(request) {
    try {
      const { searchParams } = new URL(request.url);
      const searchTerm = searchParams.get('q');
      const status = searchParams.get('status');
  
      let courses;
  
      if (searchTerm) {
        courses = await repo.searchCoursesByName(searchTerm);
      } else if (status) {
        courses = await repo.fetchCoursesByStatus(status);
      } else {
        courses = await repo.read();
      }
  
      return NextResponse.json(courses ?? [], { status: 200 });
  
    } catch (error) {
      console.error("Error in courses API:", error);
      return NextResponse.json({ message: "Error fetching courses" }, { status: 500 });
    }
  }

export async function POST(request, {params}){
    try{
        let course;
        try{
            course = await request.json();
        }
        catch(e){
            return new NextResponse("Invalid request", { status: 400 });
        }
        try{
            course = await repo.create(course);
        }
        catch(e){
            return NextResponse.json({ message: "Conflict" }, { status: 409 });
        }
        return NextResponse.json(course, { status: 201 });
    }
    catch(e){
        console.error(e);
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}