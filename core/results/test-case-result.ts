import { ITest } from "../_interfaces/test.i";
import { MatchError } from "../errors";
import { TraceMarker } from "../tracing";
import { TestOutcome } from "./test-outcome";

export class TestCaseResult {

    private _test: ITest;
    private _arguments: Array<any>;
    private _error: Error;

    public constructor(test: ITest, testCaseArguments: Array<any>, error?: Error) {
        if (error instanceof MatchError) {
            let location = TraceMarker.here(1);
            error.fileName = location.file;
            error.lineNumber = location.line;
            error.columnNumber = location.col;
        }
        this._test = test;
        this._arguments = testCaseArguments;
        this._error = error;

    }

    public get outcome(): TestOutcome {
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

    public get test(): ITest {
        return this._test;
    }

    public get arguments() {
        return this._arguments;
    }

    public get error(): Error {
        return this._error;
    }

}
