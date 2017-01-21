import * as ChildProcess from "child_process";
const packageJson = require("../package.json"); // tslint:disable-line:no-var-requires

ChildProcess.exec(`git tag -a ${packageJson.version} -m "Release ${packageJson.version}"`);
