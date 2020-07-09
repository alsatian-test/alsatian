import {
	Expect,
	Setup,
	Teardown,
	Test,
	TestCase
} from "../../../core/alsatian-core";
import { MatchError } from "../../../core/errors";
import { TestCaseResult } from "../../../core/results/test-case-result";
import { TestOutcome } from "../../../core/results/test-outcome";
import { TestBuilder } from "../../builders/test-builder";
import { TestResultsBuilder } from "../../builders/test-results-builder";
import { Logger } from "../../../core/maintenance/log";
import { TestFixtureResultsBuilder } from "../../builders/test-fixture-results-builder";
import { TestFixtureBuilder } from "../../builders/test-fixture-builder";
import { TestFixture } from "../../../core";

export class TestCaseResultTests {
	private originalLogs: Array<any>;

	@Setup
	private replaceLogArray() {
		this.originalLogs = Logger.LOGS;
		(Logger as any).LOGS = [];
	}

	@Teardown
	private restoreLogArray() {
		(Logger as any).LOGS = this.originalLogs;
	}

	@TestCase()
	@TestCase(1)
	@TestCase(1, 2)
	@TestCase("a", "list", "of", "arguments")
	@TestCase(1, "or", 2, "mixed", "arguments")
	@Test("arguments are stored in TestCaseResult")
	public argumentsAreStored(...inputArguments: Array<any>) {
		const testResults = new TestResultsBuilder().build();

		const testCaseResult = new TestCaseResult(testResults, inputArguments);

		Expect(testCaseResult.args).toEqual(inputArguments);
	}

	@Test("no error and not ignored has outcome 'pass'")
	public noErrorAndNotIgnoredTestOutcomeIsPass() {
		const testResults = new TestResultsBuilder().build();

		const testCaseResult = new TestCaseResult(testResults, []);

		Expect(testCaseResult.outcome).toEqual(TestOutcome.Pass);
	}

	@Test("no error and ignored has test outcome 'skip'")
	public noErrorAndIgnoredTestOutcomeIsSkip() {
		const test = new TestBuilder().build();
		test.ignored = true;
		const testResults = new TestResultsBuilder().withTest(test).build();

		const testCaseResult = new TestCaseResult(testResults, []);

		Expect(testCaseResult.outcome).toEqual(TestOutcome.Skip);
	}

	@TestCase(TypeError)
	@TestCase(RangeError)
	@TestCase(EvalError)
	@Test("error outcome is 'error'")
	public errorOutcomeIsError(errorType: new () => Error) {
		const test = new TestBuilder().build();
		test.ignored = true;
		const testResults = new TestResultsBuilder().withTest(test).build();

		const testCaseResult = new TestCaseResult(
			testResults,
			[],
			new errorType()
		);

		Expect(testCaseResult.outcome).toEqual(TestOutcome.Error);
	}

	@TestCase(MatchError)
	@Test("match error ouctome is 'fail'")
	public matchErrorOutcomeIsFail(errorType: new () => Error) {
		const test = new TestBuilder().build();
		test.ignored = true;
		const testResults = new TestResultsBuilder().withTest(test).build();

		const testCaseResult = new TestCaseResult(
			testResults,
			[],
			new errorType()
		);

		Expect(testCaseResult.outcome).toEqual(TestOutcome.Fail);
	}

	@TestCase(1, 2)
	@TestCase(2, 1)
	@TestCase(3, 0)
	@Test("only logs related to test are returned")
	public onlyLogsRelatedToTestAreReturned(
		matchingLogCount: number,
		otherLogCount: number
	) {
		class Fixture {
			public key() {}
		}

		const fixture = new Fixture();

		const testFixture = new TestFixtureBuilder()
			.withFixture(fixture as any)
			.withFilePath("a-given.fixture")
			.build();

		const testFixtureResult = new TestFixtureResultsBuilder()
			.withTestFixture(testFixture)
			.build();

		const test = new TestBuilder().withKey("key").build();

		const testResults = new TestResultsBuilder()
			.withTest(test)
			.withTestFixtureResults(testFixtureResult)
			.build();

		const testCaseResult = new TestCaseResult(testResults, []);

		const matchingLog = {
			value: "some log",
			stack: [
				{
					filePath: "a-given.fixture",
					functionName: "Fixture.key"
				}
			]
		};

		const matchingLogs = new Array(matchingLogCount).fill(matchingLog);

		const otherLog = {
			value: "another log",
			stack: [
				{
					filePath: "some-where.else",
					functionName: "Somewhere.else"
				}
			]
		};

		const otherLogs = new Array(otherLogCount).fill(otherLog);

		(Logger as any).LOGS = matchingLogs.concat(otherLogs);

		Expect(testCaseResult.logs.length).toBe(matchingLogCount);

		matchingLogs.forEach(log => {
			Expect(testCaseResult.logs).toContain(log);
		});
	}
}
