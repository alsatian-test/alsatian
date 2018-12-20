import {
	Expect,
	SpyOn,
	SpyOnProperty,
	Test,
	TestCase,
	TestCaseResult,
	TestOutputStream
} from "../../../core/alsatian-core";
import { MatchError } from "../../../core/errors";
import { TestBuilder } from "../../builders/test-builder";
import { TestOutcome } from "../../../core/results/test-outcome";
import { TestResultsBuilder } from "../../builders/test-results-builder";
import { ILog } from "../../../core/maintenance/log";

const _getErrorYaml = (error: MatchError, logs?: Array<string>) => {
	return (
		` ---\n` +
		` message: ${error.message
			.replace(/\\/g, "\\\\")
			.replace(/"/g, '\\"')}\n` +
		` severity: fail\n` +
		` data:\n` +
		`   got: ${yamlStringify(error.actual)}\n` +
		`   expect: ${yamlStringify(error.expected)}\n` +
		(logs !== undefined ? "   details:\n" : "") +
		buildLogs(logs) +
		` ...\n`
	);
};

function yamlStringify(value: any) {
	return `'${JSON.stringify(value)}'`;
}

const _getUnhandledErrorMessage = (stack: string, logs?: Array<string>) => {
	return (
		" ---\n" +
		" message: The test threw an unhandled error.\n" +
		" severity: fail\n" +
		" data:\n" +
		"   got: an unhandled error\n" +
		"   expect: no unhandled errors to be thrown\n" +
		"   details:\n" +
		buildLogs(logs) +
		"     stack: |-\n" +
		stack
			.split("\n")
			.map(l => "       " + l)
			.join("\n") +
		"\n ...\n"
	);
};

const buildLogs = (logs: Array<string>) => {
	return logs !== undefined
		? "     logs: |-\n" + logs.map(l => "       " + l).join("\n") + "\n"
		: "";
};

function _getUnhandledErrorMessageNoStack(): string {
	return (
		" ---\n" +
		" message: The test threw an unhandled error.\n" +
		" severity: fail\n" +
		" data:\n" +
		"   got: an unhandled error\n" +
		"   expect: no unhandled errors to be thrown\n" +
		" ...\n"
	);
}

export class EmitResultTests {
	@TestCase(1)
	@TestCase(2)
	@TestCase(3)
	public shouldEmitWithCorrectTestId(testId: number) {
		const testOutput = new TestOutputStream();
		SpyOn(testOutput, "push");

		const test = new TestBuilder().build();
		const testResults = new TestResultsBuilder().withTest(test).build();

		const testCaseResult = new TestCaseResult(testResults, []);

		testOutput.emitResult(testId, testCaseResult);

		const expected = `ok ${testId} ${testCaseResult.description}\n`;

		Expect(testOutput.push).toHaveBeenCalledWith(expected);
	}

	@TestCase("test that should pass")
	@TestCase("bla bla bla")
	@TestCase("hello this is a test")
	public shouldEmitWithCorrectTestDescription(description: string) {
		const testOutput = new TestOutputStream();
		SpyOn(testOutput, "push");

		const test = new TestBuilder().withDescription(description).build();
		const testResults = new TestResultsBuilder().withTest(test).build();

		const testCaseResult = new TestCaseResult(testResults, []);

		testOutput.emitResult(1, testCaseResult);

		const expected = `ok 1 ${testCaseResult.description}\n`;

		Expect(testOutput.push).toHaveBeenCalledWith(expected);
	}

	@TestCase([1, 5, 7, 8], "( 1, 5, 7, 8 )")
	@TestCase(["a", 3, true], '( "a", 3, true )')
	@TestCase([5.25, 6.25, 7.22], "( 5.25, 6.25, 7.22 )")
	@TestCase([TypeError, RangeError], "( TypeError, RangeError )")
	@TestCase([() => "I am anonymous"], "( anonymous function )")
	@TestCase([undefined], "( undefined )")
	public shouldEmitWithCorrectCaseArguments(
		testCaseArguments: Array<any>,
		testCaseOutput: string
	) {
		const testOutput = new TestOutputStream();
		SpyOn(testOutput, "push");

		const test = new TestBuilder().build();
		const testResults = new TestResultsBuilder().withTest(test).build();

		const testCaseResult = new TestCaseResult(
			testResults,
			testCaseArguments
		);

		testOutput.emitResult(1, testCaseResult);

		const expected = `ok 1 ${testCaseResult.description}\n`;

		Expect(testOutput.push).toHaveBeenCalledWith(expected);
	}

	@Test()
	public shouldEmitWithOkIfPass() {
		const testOutput = new TestOutputStream();
		SpyOn(testOutput, "push");

		const test = new TestBuilder().build();
		const testResults = new TestResultsBuilder().withTest(test).build();

		const testCaseResult = new TestCaseResult(testResults, []);

		testOutput.emitResult(1, testCaseResult);

		const expected = `ok 1 ${testCaseResult.description}\n`;

		Expect(testOutput.push).toHaveBeenCalledWith(expected);
	}

	@Test()
	public shouldEmitWithNotOkIfPass() {
		const testOutput = new TestOutputStream();
		SpyOn(testOutput, "push");

		const test = new TestBuilder().build();
		const testResults = new TestResultsBuilder().withTest(test).build();

		// match error causes a "fail"
		const testCaseResult = new TestCaseResult(
			testResults,
			[],
			new MatchError("message", 1, 2)
		);

		testOutput.emitResult(1, testCaseResult);

		const expected = `not ok 1 ${testCaseResult.description}\n`;

		Expect(testOutput.push).toHaveBeenCalledWith(expected);
	}

	@Test()
	public shouldEmitSkipCorrectly() {
		const testOutput = new TestOutputStream();
		SpyOn(testOutput, "push");

		const test = new TestBuilder().ignored().build();
		const testResults = new TestResultsBuilder().withTest(test).build();

		const testCaseResult = new TestCaseResult(testResults, []);

		testOutput.emitResult(1, testCaseResult);

		const expected = `ok 1 ${testCaseResult.description} # skip\n`;

		Expect(testOutput.push).toHaveBeenCalledWith(expected);
	}

	@TestCase("first reason")
	@TestCase("this reason is the second one!")
	@TestCase("last, but most certainly not least")
	public shouldEmitSkipWithReasonCorrectly(reason: string) {
		const testOutput = new TestOutputStream();
		SpyOn(testOutput, "push");

		const test = new TestBuilder().ignored(reason).build();
		const testResults = new TestResultsBuilder().withTest(test).build();

		const testCaseResult = new TestCaseResult(testResults, []);

		testOutput.emitResult(1, testCaseResult);

		const expected = `ok 1 ${
			testCaseResult.description
		} # skip ${reason}\n`;

		Expect(testOutput.push).toHaveBeenCalledWith(expected);
	}

	@Test()
	public shouldEmitErrorCorrectly() {
		const testOutput = new TestOutputStream();
		SpyOn(testOutput, "push");

		const test = new TestBuilder().build();
		const testResults = new TestResultsBuilder().withTest(test).build();

		// any error apart from a MatchError causes an "error" outcome
		const testCaseResult = new TestCaseResult(
			testResults,
			[],
			new Error("an error occured when running the test")
		);

		testOutput.emitResult(1, testCaseResult);

		const expected = `not ok 1 ${testCaseResult.description}\n`;

		Expect(testOutput.push).toHaveBeenCalledWith(expected);
	}

	@TestCase("message one")
	@TestCase("another message")
	@TestCase("yaba daba doo")
	public shouldEmitYamlWithCorrectMessage(message: string) {
		const testOutput = new TestOutputStream();
		SpyOn(testOutput, "push");

		const test = new TestBuilder().build();

		const error = new MatchError(message, 1, 2);
		const testResults = new TestResultsBuilder().withTest(test).build();

		const testCaseResult = new TestCaseResult(testResults, [], error);

		const expected = _getErrorYaml(error);

		testOutput.emitResult(1, testCaseResult);

		Expect(testOutput.push).toHaveBeenCalledWith(expected);
	}

	@TestCase(5)
	@TestCase("tweny")
	@TestCase(false)
	public shouldEmitYamlWithCorrectActualValue(actualValue: any) {
		const testOutput = new TestOutputStream();
		SpyOn(testOutput, "push");

		const test = new TestBuilder().build();

		const message = `Expected ${actualValue} to be equal to 2.`;

		const error = new MatchError(message, 2, actualValue);
		const testResults = new TestResultsBuilder().withTest(test).build();

		const testCaseResult = new TestCaseResult(testResults, [], error);

		const expected = _getErrorYaml(error);

		testOutput.emitResult(1, testCaseResult);

		Expect(testOutput.push).toHaveBeenCalledWith(expected);
	}

	@TestCase("five")
	@TestCase(20)
	@TestCase(true)
	public shouldEmitYamlWithCorrectExpectedValue(expectedValue: any) {
		const testOutput = new TestOutputStream();
		SpyOn(testOutput, "push");

		const test = new TestBuilder().build();

		const message = `Expected 1 to be equal to ${expectedValue}.`;

		const error = new MatchError(message, expectedValue, 1);
		const testResults = new TestResultsBuilder().withTest(test).build();

		const testCaseResult = new TestCaseResult(testResults, [], error);

		const expected = _getErrorYaml(error);

		testOutput.emitResult(1, testCaseResult);

		Expect(testOutput.push).toHaveBeenCalledWith(expected);
	}

	@TestCase(100)
	@TestCase(42)
	@TestCase(-42)
	public invalidResultOutcomeThrowsError(testOutcome: number) {
		const testCaseResult = { outcome: testOutcome } as TestCaseResult;

		const testOutput = new TestOutputStream();

		Expect(() => testOutput.emitResult(1, testCaseResult)).toThrowError(
			TypeError,
			`Invalid test outcome: ${testOutcome}`
		);
	}

	@TestCase("line 1\nline3\nline 7")
	@TestCase(
		"function foo in a.ts\nfunction bar in z.ts\nfunction x in entry.ts"
	)
	public shouldEmitCorrectUnhandledErrorStack(stack: string) {
		const testOutput = new TestOutputStream();
		SpyOn(testOutput, "push");

		const test = new TestBuilder().build();

		const error = new Error("empty message");
		error.stack = stack;
		const testResults = new TestResultsBuilder().withTest(test).build();

		const testCaseResult = new TestCaseResult(testResults, [], error);

		const expected = _getUnhandledErrorMessage(stack);

		testOutput.emitResult(1, testCaseResult);

		Expect(testOutput.push).toHaveBeenCalledWith(expected);
	}

	@TestCase(undefined)
	@TestCase(null)
	public shouldEmitCorrectUnhandledErrorWithUndefOrNullError(
		error: Error | null
	) {
		const testOutput = new TestOutputStream();
		SpyOn(testOutput, "push");

		const test = new TestBuilder().build();
		const testResults = new TestResultsBuilder().withTest(test).build();

		const testCaseResult = new TestCaseResult(testResults, [], error);
		SpyOnProperty(testCaseResult, "outcome").andCallGetter(
			() => TestOutcome.Error
		);

		const expected = _getUnhandledErrorMessageNoStack();

		testOutput.emitResult(1, testCaseResult);

		Expect(testOutput.push).toHaveBeenCalledWith(expected);
	}

	@TestCase("log", "something")
	@TestCase("another", "set", "of", "logs")
	public shouldEmitCorrectUnhandledErrorLogs(...logs: Array<string>) {
		const testOutput = new TestOutputStream();
		SpyOn(testOutput, "push");

		const test = new TestBuilder().build();

		const error = new Error("empty message");
		error.stack = "stack\nstack\nstack";
		const testResults = new TestResultsBuilder().withTest(test).build();

		const testCaseResult = new TestCaseResult(testResults, [], error);
		SpyOnProperty(testCaseResult, "logs").andReturnValue(
			logs.map(value => ({ value }))
		);

		const expected = _getUnhandledErrorMessage(error.stack, logs);

		testOutput.emitResult(1, testCaseResult);

		Expect(testOutput.push).toHaveBeenCalledWith(expected);
	}

	@TestCase("log", "something")
	@TestCase("another", "set", "of", "logs")
	public shouldEmitYamlWithCorrectLogs(...logs: Array<string>) {
		const testOutput = new TestOutputStream();
		SpyOn(testOutput, "push");

		const test = new TestBuilder().build();

		const error = new MatchError("message", 1, 2);
		const testResults = new TestResultsBuilder().withTest(test).build();

		const testCaseResult = new TestCaseResult(testResults, [], error);
		SpyOnProperty(testCaseResult, "logs").andReturnValue(
			logs.map(value => ({ value }))
		);

		const expected = _getErrorYaml(error, logs);

		testOutput.emitResult(1, testCaseResult);

		Expect(testOutput.push).toHaveBeenCalledWith(expected);
	}
}
