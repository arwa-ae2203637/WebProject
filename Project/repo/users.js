import { promises as fs } from "fs";
import { nanoid } from "nanoid";
import { User } from "./models/user.js";
import { Student } from "./models/student.js";
import { Instructor } from "./models/instructor.js";
import { Admin } from "./models/department-administrator.js";

export async function load(){
    try{
        const users = await fs.readFile("./repo/data/users.json");
        const parsedUsers = JSON.parse(users);
        return parsedUsers.map(user => {
            switch (user.userType) {
                case "student":
                    return Student.fromJSON(user);
                case "instructor":
                    return Instructor.fromJSON(user);
                case "admin":
                    return Admin.fromJSON(user);
            }
        })
    }
    catch(e){
        console.error("Error reading users file:", e);
    }
}

export async function save(users){
    try {
        console.log(users.map(user => user.toString()));
        await fs.writeFile("./repo/data/users.json", JSON.stringify(users.map(user => user.toJSON() )));
      } catch (e) {
        console.error(e);
      }
}

export async function read(id){
    const users = await load();
    if(id){
        const user = users.find((user) => user.id == id);
        if(!user){
            throw new Error(`User with id ${id} not found`);
        }
        return user;
    }
    return users;
}

export async function create(body){
    const users = await load();
    const duplicate = users.find((user) => user.id == body.id);

    if(duplicate){
        throw new Error(`User with id ${body.id} already exists`);
    }
    let user;
    console.log(body.userType);
    switch (body.userType) {
        case "student":
             user = Student.fromJSON(user);
             break;
        case "instructor":
             user = Instructor.fromJSON(user);
             break;
        case "admin":
             user = Admin.fromJSON(user);
             break;
    }
    console.log(user);
    users.push(user);

    await save(users);
    return user;
}  

export async function update(id, user){
    const users = await load();
    const index = users.findIndex((user) => user.id == id);
    if(index === -1){
        throw new Error(`User with id ${id} not found`);
    }
    // users[index] = { ...users[index], ...user };
    const { id: _, ...rest } = user;
    Object.assign(users[index], rest);
    
    await save(users);
    // console.log(users[index]);
    return users[index];
}

export async function remove(id){
    const users = await load();
    const index = users.findIndex((user) => user.id == id);
    if(index === -1){
        throw new Error(`User with id ${id} not found`);
    }
    users.splice(index, 1);

    await save(users);
}
