import * as child from "child_process";
import * as path from "path";

console.log(path.join(__dirname, "../node/tests"))

try {
const p = child.spawn("alsatian", [ path.join(__dirname, "../node/tests/**/*.spec.js") ]);

p.stdin.on("data", (data: string) => {
   console.log("stdin", data);
});

p.stderr.on("data", (data: string) => {
   console.log("sterr", data);
});

p.on("close", (data: string) => {
   console.log("close", data);
});

p.on("error", (data: string) => {
   console.log("close", data);
});
}
catch (error) {
   console.log("error", error);
}
