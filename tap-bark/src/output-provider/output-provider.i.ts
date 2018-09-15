import { ResultType } from "../result-type";
import { Assertion } from "../external/tap-parser";

export interface IOutputProvider {
    getResultMessage(type: ResultType, typeCount: number, totalCount: number): string;
    getTestFixtureMessage(name: string): string;
    getTestMessage(name: string): string;
    getFailureMessage(assertion: Assertion): string;
}
