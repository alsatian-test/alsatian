import * as child from "child_process";

const p = child.spawn("alsatian", [ "../node/tests/to-be.spec.js" ]);

p.stdin.on("data", (data: string) => {
   console.log(data);
});
