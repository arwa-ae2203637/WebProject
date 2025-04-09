module.exports = {

"[project]/.next-internal/server/app/classes/[id]/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

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
"[project]/repo/models/course.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "Course": (()=>Course)
});
class Course {
    #id;
    #name;
    #credit_hours;
    #category;
    #prerequisites;
    #campus;
    #status;
    constructor(obj){
        this.#id = obj?.id;
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
"[project]/repo/models/class.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "Class": (()=>Class)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$repo$2f$models$2f$course$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/repo/models/course.js [app-route] (ecmascript)");
;
class Class extends __TURBOPACK__imported__module__$5b$project$5d2f$repo$2f$models$2f$course$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Course"] {
    #crn;
    #course_id;
    #instructor;
    #class_limit;
    #schedule;
    #students;
    constructor(obj){
        super({
            ...obj
        });
        this.crn = obj.crn;
        this.course_id = obj?.course_id ?? "";
        this.instructor = obj?.instructor ?? "";
        this.class_limit = obj?.class_limit ?? 0;
        this.schedule = obj?.schedule ?? [];
        this.students = obj?.students ?? [];
    }
    // SETTERS AND GETTERS
    get crn() {
        return this.#crn;
    }
    set crn(crn) {
        this.#crn = crn;
    }
    get course_id() {
        return this.#course_id;
    }
    set course_id(course_id) {
        this.#course_id = course_id;
    }
    get instructor() {
        return this.#instructor;
    }
    set instructor(instructor) {
        this.#instructor = instructor;
    }
    get class_limit() {
        return this.#class_limit;
    }
    set class_limit(class_limit) {
        this.#class_limit = class_limit;
    }
    get schedule() {
        return this.#schedule;
    }
    set schedule(schedule) {
        this.#schedule = schedule;
    }
    get students() {
        return this.#students;
    }
    set students(students) {
        this.#students = students;
    }
    static fromJSON(json) {
        const object = typeof json === "string" ? JSON.parse(json) : json;
        return new Class(object);
    }
    // TOJSON METHOD
    toJSON() {
        return {
            ...super.toJSON(),
            crn: this.#crn,
            course_id: this.#course_id,
            instructor: this.#instructor,
            class_limit: this.#class_limit,
            schedule: this.#schedule,
            students: this.#students
        };
    }
    // TOSTRING METHOD
    toString() {
        return `${super.toString()}
              Class -
              CRN: ${this.crn}, 
              Course ID: ${this.course_id},
              Instructor: ${this.instructor}, 
              Class Limit: ${this.class_limit},
              Schedule: ${this.schedule},
              Students: ${this.students},`;
    }
}
}}),
"[project]/repo/classes.js [app-route] (ecmascript)": ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$repo$2f$models$2f$class$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/repo/models/class.js [app-route] (ecmascript)");
;
;
;
async function load() {
    try {
        const classes = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile("./repo/data/classes.json");
        const parsedClasses = JSON.parse(classes);
        return parsedClasses.map((cls)=>__TURBOPACK__imported__module__$5b$project$5d2f$repo$2f$models$2f$class$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Class"].fromJSON(cls));
    } catch (e) {
        console.error("Error reading classes file:", e);
    }
}
async function save(classes) {
    try {
        // console.log(courses.map(course => course.toString()));
        await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].writeFile("./repo/data/classes.json", JSON.stringify(classes.map((cls)=>cls.toJSON())));
    } catch (e) {
        console.error(e);
    }
}
async function read(crn) {
    const classes = await load();
    if (crn) {
        const cls = classes.find((cls)=>cls.crn == crn);
        if (!cls) {
            throw new Error(`Class with id ${crn} not found`);
        }
        return cls;
    }
    return classes;
}
async function create(body) {
    const classes = await load();
    const duplicate = classes.find((cls)=>cls.crn == body.crn);
    if (duplicate) {
        throw new Error(`Class with id ${body.id} already exists`);
    }
    let cls = __TURBOPACK__imported__module__$5b$project$5d2f$repo$2f$models$2f$class$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Class"].fromJSON(body);
    // console.log(body.userType);
    // console.log(user);
    classes.push(cls);
    await save(classes);
    return cl;
}
async function update(crn, cls) {
    const classes = await load();
    const index = classes.findIndex((cls)=>cls.crn == crn);
    if (index === -1) {
        throw new Error(`Class with crn ${crn} not found`);
    }
    Object.assign(classes[index], cls);
    await save(classes);
    return classes[index];
}
async function remove(crn) {
    const classes = await load();
    const index = classes.findIndex((cls)=>cls.crn == crn);
    if (index === -1) {
        throw new Error(`Class with id ${id} not found`);
    }
    classes.splice(index, 1);
    await save(classes);
}
}}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}}),
"[project]/app/classes/[id]/route.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "DELETE": (()=>DELETE),
    "GET": (()=>GET),
    "PUT": (()=>PUT)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$repo$2f$classes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/repo/classes.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
;
async function GET(reuqest, { params }) {
    try {
        const { crn } = await params;
        try {
            const cls = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$repo$2f$classes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["read"])(crn);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(cls.toJSON(), {
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
        const { crn } = await params;
        const body = await request.json();
        const updated = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$repo$2f$classes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["update"])(crn, body);
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
        const { crn } = await params;
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$repo$2f$classes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["remove"])(crn);
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

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__2ee7a9fa._.js.map