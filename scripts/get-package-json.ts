export function getPackageJson(): { version: string } {
    return require("../package.json"); // tslint:disable-line:no-var-requires
}
