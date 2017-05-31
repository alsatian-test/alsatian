// check if latest commit is less than a day ago
// git log -1 --pretty=format:"%cd"
import { GitProcess } from "dugite";

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
        packageJson.version += now.getFullYear() + addLeadingZeros(now.getMonth() + 1, 2) + addLeadingZeros(now.getDate(), 2);
        savePackageJson(packageJson);

        // publish
        // npm publish --tag next
    }

    function addLeadingZeros(originalNumber: number, minimumIntegerLength: number) {
        const diff = Math.ceil(minimumIntegerLength - Math.log10(originalNumber) - 1) + 1;

        if (diff > 0) {
            return new Array(diff).join("0") + originalNumber.toString();
        }

        return originalNumber.toString();
    }

    function getPackageJson(): { version: string } {
        return null;
    }

    function savePackageJson(packageJson: { version: string }) {
    }
});