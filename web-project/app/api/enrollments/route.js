import * as repo from "@/repo/enrollments.js";
import { NextResponse } from "next/server";

// export async function GET() {
//     try{
//         const enrollments = await repo.read();
//         return NextResponse.json(enrollments, {status: 200});
//     }
//     catch(e){
//         console.error(e);
//         return NextResponse.json({ message: "Error" }, { status: 500 });
//     }
// }


export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const studentId = searchParams.get('studentId');
        const status = searchParams.get('status');

        if (id) {
            const enrollment = await repo.read(id);
            return NextResponse.json(enrollment, { status: 200 });
        }

        if (studentId && status) {
            const enrollments = await repo.fetchEnrollmentsByStudentAndStatus(studentId, status);
            return NextResponse.json(enrollments, { status: 200 });
        }

        const enrollments = await repo.read();
        return NextResponse.json(enrollments, { status: 200 });

    } catch (e) {
        console.error(e);
        if (e.message.includes("not found")) {
            return NextResponse.json({ message: e.message }, { status: 404 });
        }
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