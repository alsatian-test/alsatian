import * as child from "child_process";
import * as path from "path";

console.log("hello", process.argv)

child.execSync("alsatian \"./test/integration-tests/node/tests/**/*.spec.js\"");

//child.exec("alsatian \"./test/integration-tests/node/tests/**/*.spec.js\"", (error, stdout, stderr) => {
//   console.log(`error ${error}`);
//   console.log(`stdout ${stdout}`);
//   console.log(`stderr ${stderr}`);
//});
