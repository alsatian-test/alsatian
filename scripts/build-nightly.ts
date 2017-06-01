import { exec } from "child_process";
import { GitProcess } from "dugite";
import { writeFile } from "fs";
import { padNumber } from "./pad-number";
import { getPackageJson } from "./get-package-json";

GitProcess.exec([ "log", "-1", "--format=%cd"], "./").then(x => {
    const lastCommitDate = new Date(x.stdout);
    const now = new Date();

    const ONE_DAY_IN_MILLISECONDS = 86400000;

    if (now.getTime() - lastCommitDate.getTime() > ONE_DAY_IN_MILLISECONDS) {
        process.stdout.write("nothing new to publish today\n");
    }
    else {

        const packageJson = getPackageJson();
        packageJson.version = packageJson.version.split("-")[0] + "-" + now.getFullYear() + padNumber(now.getMonth() + 1, 2) + padNumber(now.getDate(), 2);

        process.stdout.write("updated package version to: " + packageJson.version + "\n");

        writeFile("../package.json", packageJson, () => {   
            process.stdout.write("publishing " + packageJson.version + "\n");         
            exec("npm publish --tag next");
        });
    }
});