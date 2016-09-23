import { TestCaseResult } from "./test-case-result";
import { ITest } from "../_interfaces/test.i";
import { TestOutcome } from "./test-outcome";

export class TestResults {

   private _testCaseResults: Array<TestCaseResult> = [];

   public constructor(private _test: ITest) { }

   public get test(): ITest {
     return this._test;
   }

   public get outcome(): TestOutcome {
      const outcomes = this._testCaseResults.map(testCaseResult => testCaseResult.outcome);

      if (outcomes.indexOf(TestOutcome.Error) !== -1) {
         return TestOutcome.Error;
      }

      if (outcomes.indexOf(TestOutcome.Fail) !== -1) {
         return TestOutcome.Fail;
      }

      if (outcomes.indexOf(TestOutcome.Pass) !== -1) {
         return TestOutcome.Pass;
      }

      return TestOutcome.Skip;
   }

   public addTestCaseResult(args: Array<any>, error?: Error): TestCaseResult {
      const testCaseResult = new TestCaseResult(this._test, args, error);
      this._testCaseResults.push(testCaseResult);
      return testCaseResult;
   }
}
