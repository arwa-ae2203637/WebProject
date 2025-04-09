import { promises as fs } from "fs";
import { nanoid } from "nanoid";
import { Class } from "./models/class.js";

export async function load(){
    try{
        const classes = await fs.readFile("./repo/data/classes.json");
        const parsedClasses= JSON.parse(classes);
        return parsedClasses.map(cls => Class.fromJSON(cls));
    }
    catch(e){
        console.error("Error reading classes file:", e);
    }
}

export async function save(classes){
    try {
        // console.log(courses.map(course => course.toString()));
        await fs.writeFile("./repo/data/classes.json", JSON.stringify(classes.map(cls => cls.toJSON() )));
      } catch (e) {
        console.error(e);
      }
}

export async function read(crn){
    const classes = await load();
    if(crn){
        const cls = classes.find((cls) => cls.crn == crn);
        if(!cls){
            throw new Error(`Class with crn ${crn} not found`);
        }
        return cls;
    }
    return classes;
}

// export async function readCRN(crn){
//     const classes = await load();
//     if(crn){
//         const cls = classes.find((cls) => cls.crn == crn);
//         if(!cls){
//             throw new Error(`Class with id ${crn} not found`);
//         }
//         return cls;
//     }
//     return classes;
// }

export async function create(body){
    const classes = await load();
    console.log("create", classes.toString());
    const duplicate = classes.find((cls) => cls.crn == body.crn);
    if(duplicate){
        throw new Error(`Class with crn ${body.crn} already exists`);
    }
    let cls = Class.fromJSON(body);
    // console.log(body.userType);
    
    // console.log(user);
    classes.push(cls);

    await save(classes);
    return cls;
}  

export async function update(crn, cls){
    const classes = await load();
    const index = classes.findIndex((cls) => cls.crn == crn);
    if(index === -1){
        throw new Error(`Class with crn ${crn} not found`);
    }
   
    Object.assign(classes[index], cls);
    
    await save(classes);
    return classes[index];
}

export async function remove(crn){
    const classes = await load();
    const index = classes.findIndex((cls) => cls.crn == crn);
    if(index === -1){
        throw new Error(`Class with crn ${crn} not found`);
    }
    classes.splice(index, 1);

    await save(classes);
}
