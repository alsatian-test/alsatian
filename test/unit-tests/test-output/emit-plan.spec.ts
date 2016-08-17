import { Expect, TestCase, SpyOn, TestOutput } from "../../../core/alsatian-core";
import { OutputStreamBuilder } from "../../builders/output-stream-builder";

export class EmitPlanTests {

    private static _getExpectedTestPlan(testCount: number): string {
        return `1..${testCount}\n`;
    }

    @TestCase(10)
    @TestCase(25)
    @TestCase(200)
    @TestCase(250)
    public shouldEmitCorrectTestPlan(testCount: number) {
        let outStream = new OutputStreamBuilder().build();
        SpyOn(outStream, "write");

        let testOutput = new TestOutput(outStream);

        testOutput.emitPlan(testCount);

        Expect(outStream.write).toHaveBeenCalledWith(
            EmitPlanTests._getExpectedTestPlan(testCount)
        );
    }

}
