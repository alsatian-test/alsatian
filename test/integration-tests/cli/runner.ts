import * as child from "child_process";
import * as path from "path";

try {
const p = child.spawn("alsatian", [ path.join(__dirname, "../node/tests/**/*.spec.js") ]);

p.stdin.on("data", (data: string) => {
   console.log(data);
});

p.stderr.on("data", (data: string) => {
   console.log(data);
});

p.on("close", (data: string) => {
   console.log("closed", data);
});
}
catch (error) {
   console.log(error);
}
