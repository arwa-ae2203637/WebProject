import { promises as fs } from "fs";
import { nanoid } from "nanoid";
import { Course } from "./models/course.js";

export async function load(){
    try{
        const courses = await fs.readFile("./repo/data/courses.json");
        const parsedCourses = JSON.parse(courses);
        return parsedCourses.map(course => Course.fromJSON(course));
    }
    catch(e){
        console.error("Error reading courses file:", e);
    }
}

export async function save(courses){
    try {
        // console.log(courses.map(course => course.toString()));
        await fs.writeFile("./repo/data/courses.json", JSON.stringify(courses.map(course => course.toJSON() )));
      } catch (e) {
        console.error(e);
      }
}

export async function read(id){
    const courses = await load();
    if(id){
        const course = courses.find((course) => course.id == id);
        if(!course){
            throw new Error(`Course with id ${id} not found`);
        }
        return course;
    }
    return courses;
}

export async function create(body){
    const courses = await load();
    const duplicate = courses.find((course) => course.id == body.id);

    if(duplicate){
        throw new Error(`Course with id ${body.id} already exists`);
    }
    let course = Course.fromJSON(body);
    // console.log(body.userType);
    
    // console.log(user);
    courses.push(course);

    await save(courses);
    return course;
}  

export async function update(id, course){
    const courses = await load();
    const index = courses.findIndex((course) => course.id == id);
    if(index === -1){
        throw new Error(`Courses with id ${id} not found`);
    }
   
    Object.assign(courses[index], course);
    
    await save(courses);
    return courses[index];
}

export async function remove(id){
    const courses = await load();
    const index = courses.findIndex((course) => course.id == id);
    if(index === -1){
        throw new Error(`Course with id ${id} not found`);
    }
    courses.splice(index, 1);

    await save(courses);
}

