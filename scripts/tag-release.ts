const Package = require("../package.json");
import * as ChildProcess from "child_process";

ChildProcess.exec(`git tag -a ${Package.version} -m "Release ${Package.version}"`);
