import { ITestFixture } from "../_interfaces/test-fixture.i";
import { ITest } from "../_interfaces/test.i";
import { TestOutcome } from "./test-outcome";
import { TestResults } from "./test-results";
import { IResultWithOutcome } from "./result-with-outcome.i";
import { getOverallOutcome } from "./get-overall-outcome";

export class TestFixtureResults implements IResultWithOutcome {
	public readonly testResults: Array<TestResults> = [];

	public constructor(public readonly fixture: ITestFixture) {}

	get outcome(): TestOutcome {
		return getOverallOutcome(this.testResults);
	}

	public addTestResult(test: ITest): TestResults {
		const testResults = new TestResults(this, test);
		this.testResults.push(testResults);
		return testResults;
	}
}
