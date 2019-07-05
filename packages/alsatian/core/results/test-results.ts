import { ITest } from "../_interfaces/test.i";
import { TestCaseResult } from "./test-case-result";
import { TestOutcome } from "./test-outcome";
import { IResultWithOutcome } from "./result-with-outcome.i";
import { getOverallOutcome } from "./get-overall-outcome";
import { TestFixtureResults } from "../alsatian-core";

export class TestResults implements IResultWithOutcome {
	private readonly testCaseResults: Array<TestCaseResult> = [];

	public constructor(
		public readonly fixtureResult: TestFixtureResults,
		public readonly test: ITest
	) {}

	public get outcome(): TestOutcome {
		return getOverallOutcome(this.testCaseResults);
	}

	public addTestCaseResult(
		args: Array<any>,
		error: Error | null = null
	): TestCaseResult {
		const testCaseResult = new TestCaseResult(this, args, error);
		this.testCaseResults.push(testCaseResult);
		return testCaseResult;
	}
}
