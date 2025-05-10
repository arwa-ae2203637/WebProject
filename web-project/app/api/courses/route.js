import * as repo from "@/repo/courses.js";
import { NextResponse } from "next/server";

export async function GET() {
    try{
        const courses = await repo.read();
        return NextResponse.json(courses, {status: 200});
    }
    catch(e){
        console.error(e);
        return NextResponse.json({ message: "Error" }, { status: 500 });
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