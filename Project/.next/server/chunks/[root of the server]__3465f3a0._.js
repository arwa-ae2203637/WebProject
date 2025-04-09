module.exports = {

"[project]/.next-internal/server/app/courses/[id]/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

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
"[project]/repo/models/course.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "Course": (()=>Course)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/nanoid/index.js [app-route] (ecmascript) <locals>");
;
class Course {
    #id;
    #name;
    #credit_hours;
    #category;
    #prerequisites;
    #campus;
    #status;
    constructor(obj){
        this.#id = obj?.id ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])();
        this.#name = obj?.name ?? "";
        this.#credit_hours = obj?.credit_hours ?? 0;
        this.#category = obj?.category ?? "";
        this.#prerequisites = obj?.prerequisites ?? [];
        this.#campus = obj?.campus ?? "";
        this.#status = obj?.status ?? "";
    }
    get id() {
        return this.#id;
    }
    get name() {
        return this.#name;
    }
    get credit_hours() {
        return this.#credit_hours;
    }
    get category() {
        return this.#category;
    }
    get prerequisites() {
        return this.#prerequisites;
    }
    get campus() {
        return this.#campus;
    }
    get status() {
        return this.#status;
    }
    set id(value) {
        this.#id = value;
    }
    set name(value) {
        this.#name = value;
    }
    set credit_hours(value) {
        this.#credit_hours = value;
    }
    set category(value) {
        this.#category = value;
    }
    set prerequisites(value) {
        this.#prerequisites = value;
    }
    set campus(value) {
        this.#campus = value;
    }
    set status(value) {
        this.#status = value;
    }
    static fromJSON(json) {
        const object = typeof json === "string" ? JSON.parse(json) : json;
        return new Course(object);
    }
    toJSON() {
        return {
            id: this.#id,
            name: this.#name,
            credit_hours: this.#credit_hours,
            category: this.#category,
            prerequisites: this.#prerequisites,
            campus: this.#campus,
            status: this.#status
        };
    }
    toString() {
        return `Course -
      ID: ${this.#id}, 
      Name: ${this.#name}, 
      Credit Hours: ${this.#credit_hours},
      Category: ${this.#category},
      Prerequisites: ${this.#prerequisites},
      Campus: ${this.#campus},`;
    }
}
}}),
"[project]/repo/courses.js [app-route] (ecmascript)": ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$repo$2f$models$2f$course$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/repo/models/course.js [app-route] (ecmascript)");
;
;
;
async function load() {
    try {
        const courses = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile("./repo/data/courses.json");
        const parsedCourses = JSON.parse(courses);
        return parsedCourses.map((course)=>__TURBOPACK__imported__module__$5b$project$5d2f$repo$2f$models$2f$course$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Course"].fromJSON(course));
    } catch (e) {
        console.error("Error reading courses file:", e);
    }
}
async function save(courses) {
    try {
        // console.log(courses.map(course => course.toString()));
        await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].writeFile("./repo/data/courses.json", JSON.stringify(courses.map((course)=>course.toJSON())));
    } catch (e) {
        console.error(e);
    }
}
async function read(id) {
    const courses = await load();
    if (id) {
        const course = courses.find((course)=>course.id == id);
        if (!course) {
            throw new Error(`Course with id ${id} not found`);
        }
        return course;
    }
    return courses;
}
async function create(body) {
    const courses = await load();
    const duplicate = courses.find((course)=>course.id == body.id);
    if (duplicate) {
        throw new Error(`Course with id ${body.id} already exists`);
    }
    let course = __TURBOPACK__imported__module__$5b$project$5d2f$repo$2f$models$2f$course$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Course"].fromJSON(body);
    // console.log(body.userType);
    // console.log(user);
    courses.push(course);
    await save(courses);
    return course;
}
async function update(id, course) {
    const courses = await load();
    const index = courses.findIndex((course)=>course.id == id);
    if (index === -1) {
        throw new Error(`Courses with id ${id} not found`);
    }
    Object.assign(courses[index], course);
    await save(courses);
    return courses[index];
}
async function remove(id) {
    const courses = await load();
    const index = courses.findIndex((course)=>course.id == id);
    if (index === -1) {
        throw new Error(`Course with id ${id} not found`);
    }
    courses.splice(index, 1);
    await save(courses);
}
}}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}}),
"[project]/app/courses/[id]/route.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "DELETE": (()=>DELETE),
    "GET": (()=>GET),
    "PUT": (()=>PUT)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$repo$2f$courses$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/repo/courses.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
;
async function GET(reuqest, { params }) {
    try {
        const { id } = await params;
        try {
            const course = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$repo$2f$courses$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["read"])(id);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(course.toJSON(), {
                status: 200
            });
        } catch (e) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: "Not found"
            }, {
                status: 404
            });
        }
    } catch (e) {
        console.error(e);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Error"
        }, {
            status: 500
        });
    }
}
async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const updated = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$repo$2f$courses$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["update"])(id, body);
        console.log(updated);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(updated.toJSON(), {
            status: 200
        });
    } catch (e) {
        console.error(e);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Update failed"
        }, {
            status: 500
        });
    }
}
async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$repo$2f$courses$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["remove"])(id);
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"](null, {
            status: 204
        });
    } catch (e) {
        console.error(e);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Delete failed"
        }, {
            status: 500
        });
    }
}
}}),

};

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__3465f3a0._.js.map