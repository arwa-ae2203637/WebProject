module.exports = {

"[project]/.next-internal/server/app/users/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
}}),
"[externals]/next/dist/compiled/next-server/app-route.runtime.dev.js [external] (next/dist/compiled/next-server/app-route.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/app-page.runtime.dev.js [external] (next/dist/compiled/next-server/app-page.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/fs [external] (fs, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}}),
"[externals]/crypto [external] (crypto, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}}),
"[project]/repo/models/user.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "User": (()=>User)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/nanoid/index.js [app-route] (ecmascript) <locals>");
;
class User {
    #id;
    #firstName;
    #lastName;
    #username;
    #password;
    #userType;
    constructor(obj){
        if (this.constructor === User) {
            throw new Error("Can't instantiate abstract class");
        }
        this.#id = obj.id ?? User.generateId(this.#userType);
        this.#firstName = obj?.firstName ?? "";
        this.#lastName = obj?.lastName ?? "";
        this.#username = obj?.username ?? "";
        this.#password = obj?.password ?? "";
        this.#userType = obj?.userType ?? "";
    }
    // SETTERS AND GETTERS
    get id() {
        return this.#id;
    }
    get firstName() {
        return this.#firstName;
    }
    get lastName() {
        return this.#lastName;
    }
    get username() {
        return this.#username;
    }
    get password() {
        return this.#password;
    }
    get userType() {
        return this.#userType;
    }
    set firstName(firstName) {
        this.#firstName = firstName;
    }
    set lastName(lastName) {
        this.#lastName = lastName;
    }
    set username(username) {
        this.#username = username;
    }
    set password(password) {
        this.#password = password;
    }
    set userType(userType) {
        this.#userType = userType;
    }
    // GENERATE USER ID
    static generateId(userType) {
        const numId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["customAlphabet"])('0123456789', 8);
        if (userType == "admin") return `ADMIN-${numId()}`;
        else if (userType == "student") return `STUD-${numId()}`;
        else return `INST-${numId()}`;
    }
    // static fromJSON(json){
    //   const object = typeof json === "string" ? JSON.parse(json) : json; 
    //   return new User(object);
    // }
    static fromJSON(json) {
        // const object = typeof json === "string" ? JSON.parse(json) : json; 
        // return new User(object);
        throw new Error("Abstract method 'fromJSON()' must be implemented in a subclass");
    }
    toJSON() {
        return {
            id: this.#id,
            firstName: this.#firstName,
            lastName: this.#lastName,
            username: this.#username,
            password: this.#password,
            userType: this.#userType
        };
    }
    toString() {
        return `UserType: ${this.#userType}
            ID: ${this.#id}, 
            FirstName: ${this.#firstName}, 
            LastName: ${this.#lastName},
            username: ${this.#username},`;
    }
}
}}),
"[project]/repo/models/student-course.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// StudentCourse.js
__turbopack_context__.s({
    "StudentCourse": (()=>StudentCourse)
});
class StudentCourse {
    #crn;
    #course_id;
    #status;
    #grade;
    constructor(obj){
        this.#crn = obj?.crn ?? "";
        this.#course_id = obj?.course_id ?? "";
        this.#status = obj?.status ?? "pending";
        this.#grade = obj?.grade ?? "N/A";
    }
    // Getters and setters
    get crn() {
        return this.#crn;
    }
    set crn(value) {
        this.#crn = value;
    }
    get course_id() {
        return this.#course_id;
    }
    set course_id(value) {
        this.#course_id = value;
    }
    get status() {
        return this.#status;
    }
    set status(value) {
        this.#status = value;
    }
    get grade() {
        return this.#grade;
    }
    set grade(value) {
        this.#grade = value;
    }
    static fromJSON(json) {
        const object = typeof json === "string" ? JSON.parse(json) : json;
        return new StudentCourse(object);
    }
    toJSON() {
        return {
            crn: this.#crn,
            course_id: this.#course_id,
            status: this.#status,
            grade: this.#grade
        };
    }
    toString() {
        return `StudentCourse {crn: ${this.#crn}, course_id: ${this.#course_id}, status: ${this.#status}, grade: ${this.#grade || 'N/A'}}`;
    }
}
}}),
"[project]/repo/models/student.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "Student": (()=>Student)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$repo$2f$models$2f$user$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/repo/models/user.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$repo$2f$models$2f$student$2d$course$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/repo/models/student-course.js [app-route] (ecmascript)");
;
;
class Student extends __TURBOPACK__imported__module__$5b$project$5d2f$repo$2f$models$2f$user$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["User"] {
    #courses;
    constructor(obj){
        super({
            ...obj
        });
        this.#courses = obj?.courses ?? [];
    }
    // SETTERS AND GETTERS
    get courses() {
        return this.#courses;
    }
    set courses(courses) {
        this.#courses = courses;
    }
    addCourse(obj) {
        const course = new __TURBOPACK__imported__module__$5b$project$5d2f$repo$2f$models$2f$student$2d$course$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["StudentCourse"](obj);
        this.#courses.push(course);
        return course;
    }
    // FROM JSON
    static fromJSON(json) {
        const object = typeof json === "string" ? JSON.parse(json) : json;
        return new Student(object);
    }
    // TO JSON
    toJSON() {
        return {
            ...super.toJSON(),
            courses: this.#courses
        };
    }
    // TO STRING
    toString() {
        return `${super.toString()}, 
            courses: ${this.#courses.map((course)=>course.toString())}`;
    }
}
}}),
"[project]/repo/models/instructor.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "Instructor": (()=>Instructor)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$repo$2f$models$2f$user$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/repo/models/user.js [app-route] (ecmascript)");
;
class Instructor extends __TURBOPACK__imported__module__$5b$project$5d2f$repo$2f$models$2f$user$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["User"] {
    #expertise_area;
    #assigned_classes;
    constructor(obj){
        super({
            ...obj
        });
        this.#expertise_area = obj?.expertise_area ?? [];
        this.#assigned_classes = obj?.assigned_classes ?? [];
    }
    // SETTERS AND GETTERS
    get expertise_area() {
        return this.#expertise_area;
    }
    get assigned_classes() {
        return this.#assigned_classes;
    }
    set expertise_area(expertise_area) {
        this.#expertise_area = expertise_area;
    }
    set assigned_classes(assigned_classes) {
        this.#assigned_classes = assigned_classes;
    }
    // FROM JSON
    static fromJSON(json) {
        const object = typeof json === "string" ? JSON.parse(json) : json;
        return new Instructor(object);
    }
    // TO JSON
    toJSON() {
        return {
            ...super.toJSON(),
            expertise_area: this.#expertise_area,
            assigned_classes: this.#assigned_classes
        };
    }
    // TO STRING
    toString() {
        return `${super.toString()}, 
            Expertise Area: ${this.#expertise_area},
            Assigned Classes: ${this.#assigned_classes},`;
    }
}
}}),
"[project]/repo/models/department-administrator.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "Admin": (()=>Admin)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$repo$2f$models$2f$user$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/repo/models/user.js [app-route] (ecmascript)");
;
class Admin extends __TURBOPACK__imported__module__$5b$project$5d2f$repo$2f$models$2f$user$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["User"] {
    constructor(obj){
        super({
            ...obj
        });
    }
    // From JSON
    static fromJSON(json) {
        const object = typeof json === "string" ? JSON.parse(json) : json;
        return new Admin(object);
    }
    // TO JSON
    toJSON() {
        return {
            ...super.toJSON()
        };
    }
    // TO STRING
    toString() {
        return `${super.toString()}`;
    }
}
}}),
"[project]/repo/users.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "create": (()=>create),
    "load": (()=>load),
    "read": (()=>read),
    "remove": (()=>remove),
    "save": (()=>save),
    "update": (()=>update)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$repo$2f$models$2f$user$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/repo/models/user.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$repo$2f$models$2f$student$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/repo/models/student.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$repo$2f$models$2f$instructor$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/repo/models/instructor.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$repo$2f$models$2f$department$2d$administrator$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/repo/models/department-administrator.js [app-route] (ecmascript)");
;
;
;
;
;
;
async function load() {
    try {
        const users = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile("./repo/data/users.json");
        const parsedUsers = JSON.parse(users);
        return parsedUsers.map((user)=>{
            switch(user.userType){
                case "student":
                    return __TURBOPACK__imported__module__$5b$project$5d2f$repo$2f$models$2f$student$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Student"].fromJSON(user);
                case "instructor":
                    return __TURBOPACK__imported__module__$5b$project$5d2f$repo$2f$models$2f$instructor$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Instructor"].fromJSON(user);
                case "admin":
                    return __TURBOPACK__imported__module__$5b$project$5d2f$repo$2f$models$2f$department$2d$administrator$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Admin"].fromJSON(user);
            }
        });
    } catch (e) {
        console.error("Error reading users file:", e);
    }
}
async function save(users) {
    try {
        console.log(users.map((user)=>user.toString()));
        await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].writeFile("./repo/data/users.json", JSON.stringify(users.map((user)=>user.toJSON())));
    } catch (e) {
        console.error(e);
    }
}
async function read(id) {
    const users = await load();
    if (id) {
        const user = users.find((user)=>user.id == id);
        if (!user) {
            throw new Error(`User with id ${id} not found`);
        }
        return user;
    }
    return users;
}
async function create(body) {
    const users = await load();
    const duplicate = users.find((user)=>user.id == body.id);
    if (duplicate) {
        throw new Error(`User with id ${body.id} already exists`);
    }
    let user;
    console.log(body.userType);
    switch(body.userType){
        case "student":
            user = __TURBOPACK__imported__module__$5b$project$5d2f$repo$2f$models$2f$student$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Student"].fromJSON(user);
            break;
        case "instructor":
            user = __TURBOPACK__imported__module__$5b$project$5d2f$repo$2f$models$2f$instructor$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Instructor"].fromJSON(user);
            break;
        case "admin":
            user = __TURBOPACK__imported__module__$5b$project$5d2f$repo$2f$models$2f$department$2d$administrator$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Admin"].fromJSON(user);
            break;
    }
    console.log(user);
    users.push(user);
    await save(users);
    return user;
}
async function update(id, user) {
    const users = await load();
    const index = users.findIndex((user)=>user.id == id);
    if (index === -1) {
        throw new Error(`User with id ${id} not found`);
    }
    // users[index] = { ...users[index], ...user };
    const { id: _, ...rest } = user;
    Object.assign(users[index], rest);
    await save(users);
    // console.log(users[index]);
    return users[index];
}
async function remove(id) {
    const users = await load();
    const index = users.findIndex((user)=>user.id == id);
    if (index === -1) {
        throw new Error(`User with id ${id} not found`);
    }
    users.splice(index, 1);
    await save(users);
}
}}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}}),
"[project]/app/users/route.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "GET": (()=>GET),
    "POST": (()=>POST)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$repo$2f$users$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/repo/users.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
;
async function GET() {
    try {
        const users = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$repo$2f$users$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["read"])();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(users.map((user)=>user.toJSON()), {
            status: 200
        });
    } catch (e) {
        console.error(e);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Error"
        }, {
            status: 500
        });
    }
}
async function POST(request, { params }) {
    try {
        let user;
        try {
            user = await request.json();
        } catch (e) {
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"]("Invalid request", {
                status: 400
            });
        }
        try {
            user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$repo$2f$users$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["create"])(user);
        } catch (e) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: "Conflict"
            }, {
                status: 409
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(user.toJSON(), {
            status: 201
        });
    } catch (e) {
        console.error(e);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Error"
        }, {
            status: 500
        });
    }
}
}}),

};

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__6ce40f21._.js.map