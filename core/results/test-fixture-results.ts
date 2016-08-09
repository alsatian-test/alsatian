import { ITestFixture } from "../_interfaces/test-fixture.i";
import { ITest } from "../_interfaces/test.i";
import { TestOutcome } from "./test-outcome";
import { TestResults } from "./test-results";

export class TestFixtureResults {

   private _testResults: Array<TestResults> = [];

   get outcome(): TestOutcome {
      const outcomes = this._testResults.map(testResult => testResult.outcome);

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

   public constructor(private _testFixture: ITestFixture) { }

   public addTestResult(test: ITest): TestResults {
      const testResults = new TestResults(test);
      this._testResults.push(testResults);
      return testResults;
   }
}
