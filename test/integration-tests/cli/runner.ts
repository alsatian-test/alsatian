import * as child from "child_process";

const p = child.spawn("alsatian", [ "../tests/to-be.spec.ts" ]);

p.stdin.on("data", (data: string) => {
   console.log(data);
});
