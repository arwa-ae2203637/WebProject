import * as repo from "@/repo/enrollments.js";
import { NextResponse } from "next/server";

export async function GET() {
    try{
        const enrollments = await repo.read();
        return NextResponse.json(enrollments, {status: 200});
    }
    catch(e){
        console.error(e);
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}

export async function POST(request, {params}){
    try{
        let enrollment;
        try{
          enrollment = await request.json();
        }
        catch(e){
            return new NextResponse("Invalid request", { status: 400 });
        }
        try{
          enrollment = await repo.create(enrollment);
        }
        catch(e){
            return NextResponse.json({ message: "Conflict" }, { status: 409 });
        }
        return NextResponse.json(enrollment, { status: 201 });
    }
    catch(e){
        console.error(e);
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}