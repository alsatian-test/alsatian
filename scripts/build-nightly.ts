import { spawn } from "child_process";
import { GitProcess } from "dugite";
import { writeFile } from "fs";
import { getPackageJson } from "./get-package-json";
import { padNumber } from "./pad-number";

GitProcess.exec([ "log", "-1", "--format=%cd"], "./").then(async result => {
    const lastCommitDate = new Date(result.stdout);
    const now = new Date();

    const ONE_DAY_IN_MILLISECONDS = 86400000;

    if (process.env.TRAVIS_JOB_NUMBER && process.env.TRAVIS_JOB_NUMBER.split(".")[1] !== "-1") {
        process.stdout.write("nothing to do here, publishing is handled on another job\n");
        process.exit(0);
    }
    else if (now.getTime() - lastCommitDate.getTime() > ONE_DAY_IN_MILLISECONDS) {
        process.stdout.write("nothing new to publish today\n");
        process.exit(0);
    }
    else {

        const packageJson = getPackageJson();
        packageJson.version = packageJson.version.split("-")[0] + "-" +
                              now.getFullYear() + padNumber(now.getMonth() + 1, 2) + padNumber(now.getDate(), 2);
        
        try {
            process.stdout.write("updating package.json");
            await writeFileAsync("./package.json", JSON.stringify(packageJson, null, 3));
            process.stdout.write(`updated package.json version to ${packageJson.version}\n`);

            if (process.env.NPM_AUTH_TOKEN) {
                process.stdout.write("building .npmrc\n");
                await writeFileAsync("./.npmrc", "//registry.npmjs.org/:_authToken=${NPM_AUTH_TOKEN}\n");
                process.stdout.write("built .npmrc\n");
            }
            process.stdout.write(packageJson.version + " ready to publish\n");
            await npmPublish();
            process.stdout.write(packageJson.version + " publishedh\n");
            process.exit(0);
        }
        catch(error) {
            process.stderr.write("publish failed: " + error.message);
            process.exit(1);            
        }
    }
});

async function writeFileAsync(fileLocation: string, fileContents: string) {
    return new Promise((resolve, reject) => {
        writeFile(fileLocation, fileContents, (error: Error) => {
            
            if (error) {
                return reject(error);
            }
            
            resolve();
        });
    });
}

async function npmPublish() {

    return new Promise((resolve, reject) => {
        
        const publishProcess = spawn("npm", [ "publish", "--tag", "next" ]);

        publishProcess.on("close", (code, signal) => {
            resolve();
        });

        publishProcess.stdout.pipe(process.stdout);
        publishProcess.stderr.pipe(process.stderr);
    });
}
