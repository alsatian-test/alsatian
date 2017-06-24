import { exec } from "child_process";
import { getPackageJson } from "./get-package-json";

const packageJson = getPackageJson();

exec(`git tag -a ${packageJson.version} -m "Release ${packageJson.version}"`);
