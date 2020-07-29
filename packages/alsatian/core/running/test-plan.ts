import { ITest } from "../_interfaces";
import { TestSet } from "../test-set";
import { TestItem } from "./test-item";

export class TestPlan {
	private _testItems: Array<TestItem> = [];
	public get testItems() {
		return this._testItems;
	}

	public constructor(public readonly testSet: TestSet) {
		if (testSet.testFixtures.length === 0) {
			return;
		}

		const testFixtures = testSet.testFixtures;

		// are there any tests or test fixtures focussed
		const focussedTestsOrTestFixtures =
			testFixtures.filter(
				testFixture =>
					testFixture.focussed ||
					testFixture.tests.some(test => test.focussed)
			).length > 0;

		testFixtures.forEach(testFixture => {
			// run all tests if no tests or fixtures anywhere are focussed
			let testsToRun: Array<ITest> = testFixture.tests;

			//TODO: perhaps move focus / ignore removal to somewhere else
			// otherwise if there are tests or fixtures focussed
			if (focussedTestsOrTestFixtures) {
				// if any of the tests are focussed choose just those
				if (testFixture.tests.some(test => test.focussed)) {
					testsToRun = testFixture.tests.filter(
						test => test.focussed
					);
				} else if (testFixture.focussed === false) {
					// if no tests are focussed and the fixture itself is not focussed run no tests
					testsToRun = [];
				}
			}

			// this._testItems.push(testsToRun.map(t => t.testItems).reduce((c, i) => c.concat(i), []))

			// testsToRun.forEach(test => {
			// 	test.testCases.forEach(testCase => {
			// 		this._testItems.push(
			// 			new TestItem(testFixture, test, testCase)
			// 		);
			// 	});
			// });
		});
	}
}
