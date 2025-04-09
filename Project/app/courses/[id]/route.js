import * as repo from "@/repo/courses.js";
import { NextResponse } from "next/server";

export async function GET(reuqest, {params}){
    try{
        const {id} = await params;
        try{
            const course = await repo.read(id);
            return NextResponse.json(course.toJSON(), {status: 200});
        }
        catch(e){
            return NextResponse.json({ message: "Not found" }, { status: 404 });
        }
    }
    catch(e){
        console.error(e);
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}

export async function PUT(request, {params}){
    try {
        const { id } = await params;
        const body = await request.json();
    
        const updated = await repo.update(id, body);
        console.log(updated);
        return NextResponse.json(updated.toJSON(), { status: 200 });
      } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "Update failed" }, { status: 500 });
      }
}

export async function DELETE(request, {params}){
    try {
        const { id } = await params;
    
        await repo.remove(id);
        return new NextResponse(null, { status: 204 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "Delete failed" }, { status: 500 });
      }
}