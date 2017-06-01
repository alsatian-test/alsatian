import { spawn } from "child_process";
import { GitProcess } from "dugite";
import { writeFile } from "fs";
import { getPackageJson } from "./get-package-json";
import { padNumber } from "./pad-number";

GitProcess.exec([ "log", "-1", "--format=%cd"], "./").then(x => {
    const lastCommitDate = new Date(x.stdout);
    const now = new Date();

    const ONE_DAY_IN_MILLISECONDS = 86400000;

    if (now.getTime() - lastCommitDate.getTime() > ONE_DAY_IN_MILLISECONDS) {
        process.stdout.write("nothing new to publish today\n");
        process.exit(1);
    }
    else {

        const packageJson = getPackageJson();
        packageJson.version = packageJson.version.split("-")[0] + "-" +
                              now.getFullYear() + padNumber(now.getMonth() + 1, 2) + padNumber(now.getDate(), 2);

        writeFile("./package.json", JSON.stringify(packageJson, null, 3), (error) => {
            if (error) {
                process.stderr.write("publish preparation failed: " + error.message);
                process.exit(1);
            }
            else {
                process.stdout.write(packageJson.version + " ready to publish\n");
                process.exit(0);
            }
        });
    }
});
