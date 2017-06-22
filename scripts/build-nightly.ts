import { spawn } from "child_process";
import { writeFile } from "fs";
import { getPackageJson } from "./get-package-json";
import { padNumber } from "./pad-number";

if (process.env.TRAVIS_JOB_NUMBER && process.env.TRAVIS_JOB_NUMBER.split(".")[1] !== "-1") {
    process.stdout.write("nothing to do here, publishing is handled on another job\n");
    process.exit(0);
}
else {
    // tslint:disable-next-line
    require("dugite").GitProcess.exec([ "log", "-1", "--format=%cd"], "./").then((response: any) => {
        const lastCommitDate = new Date(response.stdout);
        const now = new Date();

        const ONE_DAY_IN_MILLISECONDS = 86400000;

        if (now.getTime() - lastCommitDate.getTime() > ONE_DAY_IN_MILLISECONDS) {
            process.stdout.write("nothing new to publish today\n");
            process.exit(0);
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

                    const publishProcess = spawn("npm", [ "publish", "--tag", "next" ]);

                    publishProcess.on("close", (code, signal) => {
                        process.stdout.write(packageJson.version + " publishedh\n");
                        process.exit(0);
                    });

                    publishProcess.stdout.pipe(process.stdout);
                    publishProcess.stderr.pipe(process.stderr);
                }
            });
        }
    });
}
