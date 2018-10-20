import {
  Expect,
  SpyOn,
  TestCase,
  TestOutputStream
} from "../../../core/alsatian-core";

export class EmitPlanTests {
  private static _getExpectedTestPlan(testCount: number): string {
    return `1..${testCount}\n`;
  }

  @TestCase(10)
  @TestCase(25)
  @TestCase(200)
  @TestCase(250)
  public shouldEmitCorrectTestPlan(testCount: number) {
    const testOutput = new TestOutputStream();
    SpyOn(testOutput, "push");

    testOutput.emitPlan(testCount);

    Expect(testOutput.push).toHaveBeenCalledWith(
      EmitPlanTests._getExpectedTestPlan(testCount)
    );
  }
}
