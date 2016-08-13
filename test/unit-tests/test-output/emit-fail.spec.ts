import { Expect, TestCase, SpyOn } from "../../../core/alsatian-core";
import { ITest } from "../../../core/_interfaces/test.i";
import { TestBuilder } from "../../builders/test-builder";
import { getDummyStream } from "./_utils";
import { TestOutput } from "../../../core/test-output";

export class EmitFailTests {

    @TestCase(1)
    @TestCase(2)
    @TestCase(3)
    public shouldEmitWithCorrectTestId(testId: number) {
        let outStream = getDummyStream();
        SpyOn(outStream, "write");

        let testOutput = new TestOutput(outStream);

        let test: ITest = new TestBuilder().build();

        testOutput.emitFail(testId, test, undefined, undefined);

        let expected = `not ok ${testId} ${test.description}\n`;

        Expect(outStream.write).toHaveBeenCalledWith(expected);
    }

    @TestCase("test that should pass")
    @TestCase("bla bla bla")
    @TestCase("hello this is a test")
    public shouldEmitWithCorrectTestDescription(description: string) {
        let outStream = getDummyStream();
        SpyOn(outStream, "write");

        let testOutput = new TestOutput(outStream);

        let test: ITest = new TestBuilder()
            .withDescription(description).build();

        testOutput.emitFail(1, test, undefined, undefined);

        let expected = `not ok 1 ${description}\n`;

        Expect(outStream.write).toHaveBeenCalledWith(expected);
    }

    @TestCase([ 1, 5, 7, 8 ], "[ 1, 5, 7, 8 ]")
    @TestCase([ "a", 3, true ], "[ \"a\", 3, true ]")
    @TestCase([ 5.25, 6.25, 7.22 ], "[ 5.25, 6.25, 7.22 ]")
    public shouldEmitWithCorrectCaseArguments(testCaseArguments: Array<any>, testCaseOutput: string) {
        let outStream = getDummyStream();
        SpyOn(outStream, "write");

        let testOutput = new TestOutput(outStream);

        let test: ITest = new TestBuilder().build();

        testOutput.emitFail(1, test, testCaseArguments, undefined);

        let expected = `not ok 1 ${test.description} ${testCaseOutput}\n`;

        Expect(outStream.write).toHaveBeenCalledWith(expected);
    }

}
