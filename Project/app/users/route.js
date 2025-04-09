import * as repo from "@/repo/users.js";
import { NextResponse } from "next/server";

export async function GET() {
    try{
        const users = await repo.read();
        return NextResponse.json(users.map(user => user.toJSON()), {status: 200});
    }
    catch(e){
        console.error(e);
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}

export async function POST(request, {params}){
    try{
        let user;
        try{
            user = await request.json();
        }
        catch(e){
            return new NextResponse("Invalid request", { status: 400 });
        }
        try{
            user = await repo.create(user);
        }
        catch(e){
            return NextResponse.json({ message: "Conflict" }, { status: 409 });
        }
        return NextResponse.json(user.toJSON(), { status: 201 });
    }
    catch(e){
        console.error(e);
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}