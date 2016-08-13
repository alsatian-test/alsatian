import { Expect, TestCase, SpyOn } from "../../../core/alsatian-core";
import { getDummyStream } from "./_utils";
import { TestOutput } from "../../../core/test-output";

export class EmitPlanTests {

    private static _getExpectedTestPlan(testCount: number): string {
        return `1..${testCount}\n`;
    }

    @TestCase(10)
    @TestCase(25)
    @TestCase(200)
    @TestCase(250)
    public shouldEmitCorrectTestPlan(testCount: number) {
        let outStream = getDummyStream();
        SpyOn(outStream, "write");

        let errStream = getDummyStream();

        let testOutput = new TestOutput(outStream, errStream);

        testOutput.emitPlan(testCount);

        Expect(outStream.write).toHaveBeenCalledWith(
            EmitPlanTests._getExpectedTestPlan(testCount)
        );
    }

}
