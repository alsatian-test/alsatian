import { TestSet } from "./test-set";
import { TestItem } from "./test-item";

export class TestPlan {

  private _testItems: Array<TestItem> = [];
  public get testItems() {
    return this._testItems;
  }

  public constructor(testSet: TestSet) {

    let testFixtures = testSet.testFixtures;

    const focussedTestFixtures = testFixtures.filter(testFixture => testFixture.focussed || testFixture.tests.some(test => test.focussed));

    if (focussedTestFixtures.length > 0) {
      testFixtures = focussedTestFixtures;

      testFixtures.forEach(testFixture => {
         if (testFixture.tests.some(test => test.focussed)) {
            testFixture.tests = testFixture.tests.filter(test => test.focussed);
         }
      });
    }

    testFixtures.forEach(testFixture => {
      testFixture.tests.forEach(test => {
        test.testCases.forEach(testCase => {

          this._testItems.push(new TestItem(testFixture, test, testCase));
        });
      });
    });
  }
}
