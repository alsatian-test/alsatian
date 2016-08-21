import { TestSet } from "./test-set";
import { TestItem } from "./test-item";

export class TestPlan {

  private _testItems: Array<TestItem> = [];
  public get testItems() {
    return this._testItems;
  }

  public constructor(testSet: TestSet) {
    testSet.testFixtures.forEach(testFixture => {
      testFixture.tests.forEach(test => {
        test.testCases.forEach(testCase => {

          this._testItems.push(new TestItem(testFixture, test, testCase));
        });
      });
    });
  }
}
