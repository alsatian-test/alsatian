import { GitProcess } from "dugite";
import { padNumber } from "./pad-number";

GitProcess.exec([ "log", "-1", "--format=%cd"], "./").then(x => {
    const lastCommitDate = new Date(x.stdout);
    const now = new Date();

    const ONE_DAY_IN_MILLISECONDS = 86400000;

    if (now.getTime() - lastCommitDate.getTime() > ONE_DAY_IN_MILLISECONDS) {
        process.stdout.write("nothing new to publish today");
    }
    else {

        // update version {{version}}-YYYYMMDD
        const packageJson = getPackageJson()
        packageJson.version += now.getFullYear() + padNumber(now.getMonth() + 1, 2) + padNumber(now.getDate(), 2);
        savePackageJson(packageJson);

        // publish
        // npm publish --tag next
    }

    function getPackageJson(): { version: string } {
        return null;
    }

    function savePackageJson(packageJson: { version: string }) {
    }
});