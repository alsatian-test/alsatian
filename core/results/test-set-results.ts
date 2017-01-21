import { ITestFixture } from "../_interfaces/test-fixture.i";
import { TestFixtureResults } from "./test-fixture-results";
import { TestOutcome } from "./test-outcome";

export class TestSetResults {

   private _testFixtureResults: Array<TestFixtureResults> = [];
   public get testFixtureResults() {
     return this._testFixtureResults;
   }

   get outcome(): TestOutcome {
      const outcomes = this._testFixtureResults.map(testFixtureResult => testFixtureResult.outcome);

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

   public addTestFixtureResult(testFixture: ITestFixture): TestFixtureResults {
      let testFixtureResult = new TestFixtureResults(testFixture);
      this._testFixtureResults.push(testFixtureResult);
      return testFixtureResult;
   }
}
