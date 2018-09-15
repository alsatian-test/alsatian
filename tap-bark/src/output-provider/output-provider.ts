import { IOutputProvider } from "./output-provider.i";
import { ResultType } from "../result-type";
import { Assertion } from "../external/tap-parser";
import { fail } from "assert";
const chalk = require("chalk");

export class OutputProvider implements IOutputProvider {
    public getResultMessage(type: ResultType, typeCount: number, totalCount: number): string {
        switch (type) {
            case ResultType.PASS:
                return chalk.green(`Pass: ${typeCount}/${totalCount}`);

            case ResultType.FAIL:
                return chalk.red(`Fail: ${typeCount}/${totalCount}`);

            case ResultType.IGNORE:
                return chalk.yellow(`Ignore: ${typeCount}/${totalCount}`);
        }

        throw new TypeError("Invalid ResultType.");
    }

    public getTestFixtureMessage(name: string): string {
        return `# [${name}]`;
    }

    public getTestMessage(name: string): string {
        return ` --- ${name}`;
    }

    public getFailureMessage(assertion: Assertion): string {

        const failureTitle = chalk.red("FAIL: ") + chalk.bold(assertion.name) + "\n";

        if (assertion.diag) {
            const data = assertion.diag.data;
            const details = data.details;
            const title = `${failureTitle} ${assertion.diag.message}\n`;

            if (details && Object.keys(details).length > 0) {
                return `${title}${
                    Object.keys(details)
                            .map(key => `\n${key}:\n${details[key]}`)
                            .join("\n")
                    }`;
            }

            return `${title}\nexpected:\n${data.expect}\nactual:\n${data.got}`;
        }

        return failureTitle + "Failure reason unknown.";
    }
}
