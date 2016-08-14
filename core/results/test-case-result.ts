import { TestOutcome } from "./test-outcome";
import { ITest } from "../_interfaces/test.i";
import { MatchError } from "../_errors";

export class TestCaseResult {

    private _test: ITest;
    private _arguments: Array<any>;
    private _error: Error;

    public getTest(): ITest {
        return this._test;
    }

    public getArguments(): Array<any> {
        return this._arguments;
    }

    public getError(): Error {
        return this._error;
    }

    public getOutcome(): TestOutcome {
        if (this._error) {
            if (this._error instanceof MatchError) {
                return TestOutcome.Fail;
            }

            return TestOutcome.Error;
        }

        if (this._test.ignored) {
            return TestOutcome.Skip;
        }

        return TestOutcome.Pass;
    }

    public constructor(test: ITest, testCaseArguments: Array<any>, error?: Error) {
        this._test = test;
        this._arguments = testCaseArguments;
        this._error = error;
    }
}
