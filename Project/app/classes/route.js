// import * as repo from "@/repo/classes.js";
// import { NextResponse } from "next/server";

// export async function GET() {
//     try{
//         const classes = await repo.read();
//         return NextResponse.json(classes.map(cls => cls.toJSON()), {status: 200});
//     }
//     catch(e){
//         console.error(e);
//         return NextResponse.json({ message: "Error" }, { status: 500 });
//     }
// }

// export async function POST(request, {params}){
//     try{
//         let cls;
//         try{
//             cls = await request.json();
//         }
//         catch(e){
//             return new NextResponse("Invalid request", { status: 400 });
//         }
//         try{
//             cls = await repo.create(cls);
//         }
//         catch(e){
//             return NextResponse.json({ message: "Conflict" }, { status: 409 });
//         }
//         return NextResponse.json(cls.toJSON(), { status: 201 });
//     }
//     catch(e){
//         console.error(e);
//         return NextResponse.json({ message: "Error" }, { status: 500 });
//     }
// }

import * as repo from "@/repo/classes.js";
import { NextResponse } from "next/server";

export async function GET() {
    try{
        const classes = await repo.read();
        return NextResponse.json(classes.map(cls => cls.toJSON()), {status: 200});
    }
    catch(e){
        console.error(e);
        return NextResponse.json({ message: "Error" }, { status: 500 });
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
        return NextResponse.json(cls.toJSON(), { status: 201 });
    }
    catch(e){
        console.error(e);
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}