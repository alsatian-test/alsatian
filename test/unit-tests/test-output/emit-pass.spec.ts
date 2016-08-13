import { Expect, TestCase, SpyOn } from "../../../core/alsatian-core";
import { ITest } from "../../../core/_interfaces/test.i";
import { TestBuilder } from "../../builders/test-builder";
import { getDummyStream } from "./_utils";
import { TestOutput } from "../../../core/test-output";

export class EmitPassTests {

    private static _getExpectedTestPlan(testCount: number): string {
        return `1..${testCount}\n`;
    }

    @TestCase(1)
    @TestCase(2)
    @TestCase(3)
    public shouldEmitWithCorrectTestId(testId: number) {
        let outStream = getDummyStream();
        SpyOn(outStream, "write");

        let testOutput = new TestOutput(outStream);

        let test: ITest = new TestBuilder().build();

        testOutput.emitPass(testId, test, undefined);

        let expected = `ok ${testId} ${test.description}`;

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

        testOutput.emitPass(1, test, undefined);

        let expected = `ok 1 ${description}`;

        Expect(outStream.write).toHaveBeenCalledWith(expected);
    }

    @Test([ 1, 5, 7, 8 ])
    @Test([ "a", 3, true ])
    @Test([ 5.25, 6.25, 7.22 ])
    public shouldEmitWithCorrectCaseArguments(testCaseArguments: Array<any>) {
        let testCaseOutput = testCaseArguments.join(", ");

        let outStream = getDummyStream();
        SpyOn(outStream, "write");

        let testOutput = new TestOutput(outStream);

        let test: ITest = new TestBuilder().build();

        testOutput.emitPass(1, test, testCaseArguments);

        let expected = `ok 1 ${test.description} ${testCaseOutput}`;

        Expect(outStream.write).toHaveBeenCalledWith(expected);
    }

}
