import { TestResults, TestFixtureResults } from "../../core/results";
import { TestFixtureResultsBuilder } from "./test-fixture-results-builder";
import { TestBuilder } from "./test-builder";
import { ITest } from "../../core/_interfaces";

export class TestResultsBuilder {
	private test: ITest = new TestBuilder().build();
	private testFixtureResults = new TestFixtureResultsBuilder().build();

	public withTest(test: ITest) {
		this.test = test;
		return this;
	}

	public withTestFixtureResults(testFixtureResults: TestFixtureResults) {
		this.testFixtureResults = testFixtureResults;
		return this;
	}

	public build() {
		return new TestResults(this.testFixtureResults, this.test);
	}
}
