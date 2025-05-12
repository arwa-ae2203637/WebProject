import * as usersRepo from "@/repo/users.js";
import { NextResponse } from "next/server";

// export async function GET() {
//     try{
//         const users = await usersRepo.read();
//         return NextResponse.json(users, {status: 200});
//     }
//     catch(e){
//         console.error(e);
//         return NextResponse.json({ message: "Error" }, { status: 500 });
//     }
// }

export async function GET(request) {
    try {
      const { searchParams } = new URL(request.url);
  
      const userType = searchParams.get('userType');
      const enrollmentCrn = searchParams.get('enrollmentCrn');
  
      let users;
  
      if (userType || enrollmentCrn) {
        const filters = {
          userType: userType || undefined,
          enrollmentCrn: enrollmentCrn || undefined,
        };
        users = await usersRepo.getUsers(filters);
      } else {
        users = await usersRepo.read();  
      }
  
      return NextResponse.json(users, { status: 200 });
    } catch (e) {
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
            user = await usersRepo.create(user);
        }
        catch(e){
            return NextResponse.json({ message: "Conflict" }, { status: 409 });
        }
        return NextResponse.json(user, { status: 201 });
    }
    catch(e){
        console.error(e);
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}