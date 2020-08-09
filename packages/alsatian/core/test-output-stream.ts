import { Readable as ReadableStream } from "stream";
import { ITestFixture } from "./_interfaces";
import { MatchError } from "./errors";
import { TestCaseResult, TestOutcome } from "./results";
import { stringify } from "./stringification";
import { safeDump } from "js-yaml";
import { ILog } from "./maintenance/log";

export class TestOutputStream extends ReadableStream {
	public _read() {} // tslint:disable-line:no-empty

	public end() {
		this.push(null);
	}

	public emitVersion(): void {
		this.writeOut("TAP version 13\n");
	}

	public emitPlan(testCount: number): void {
		this.writeOut(`1..${testCount}\n`);
	}

	public emitFixture(fixture: ITestFixture): void {
		this.writeOut(`# FIXTURE ${fixture.description}\n`);
	}

	public emitLog(...logs: Array<string>): void {
		this.writeLogs(logs, "LOG");
	}

	public emitWarning(...warnings: Array<string>): void {
		this.writeLogs(warnings, "WARN");
	}

	public emitResult(testId: number, result: TestCaseResult): void {
		const outcome = result.outcome;

		if (outcome === TestOutcome.Pass) {
			this.emitPass(testId, result);
		} else if (
			outcome === TestOutcome.Fail ||
			outcome === TestOutcome.Error
		) {
			this.emitFail(testId, result);
		} else if (outcome === TestOutcome.Skip) {
			this.emitSkip(testId, result);
		} else {
			throw new TypeError(`Invalid test outcome: ${outcome}`);
		}
	}

	private writeLogs(logs: Array<string>, level: string) {
		this.writeOut(`# ${level}: ${logs.join(" ")}\n`);
	}

	private writeOut(message: string): void {
		this.push(message);
	}

	private emitPass(testId: number, result: TestCaseResult): void {
		this.writeOut(`ok ${testId} ${result.description}\n`);
	}

	private emitSkip(testId: number, result: TestCaseResult): void {
		const test = result.testResults.test;

		const reasonString = test.ignoreReason ? ` ${test.ignoreReason}` : "";

		this.writeOut(
			`ok ${testId} ${result.description} # skip${reasonString}\n`
		);
	}

	private emitFail(testId: number, result: TestCaseResult): void {
		this.writeOut(`not ok ${testId} ${result.description}\n`);

		if (result.error && result.error.name === MatchError.name) {
			this.writeMatchErrorOutput(result, result.logs);
		} else {
			this.writeUnhandledErrorOutput(result, result.logs);
		}
	}

	private writeMatchErrorOutput(result: TestCaseResult, logs: Array<ILog>): void {
		const error = result.error as MatchError;

		const sanitisedMessage = error.message
			.replace(/\\/g, "\\\\")
			.replace(/"/g, '\\"');
		const sanitisedActual = stringify(error.actual);
		const sanitisedExpected = stringify(error.expected);

		this.writeFailure(
			sanitisedMessage,
			sanitisedActual,
			sanitisedExpected,
			result.testResults.fixtureResult.fixture.filePath,
			this.extrasWithLogs(error.extras, logs)
		);
	}

	private writeUnhandledErrorOutput(
		result: TestCaseResult,
		logs: Array<ILog>
	): void {
		const error = result.error;

		this.writeFailure(
			"The test threw an unhandled error.",
			"an unhandled error",
			"no unhandled errors to be thrown",
			result.testResults.fixtureResult.fixture.filePath,
			error instanceof Error
				? this.extrasWithLogs({
					type: error.name,
					message: error.message,
					stack: error.stack || "no stack found"
				}, logs)
				: undefined
		);
	}

	private extrasWithLogs(extras: { [prop: string]: any } | undefined, logs: Array<ILog>) {
		if (logs && logs.length) {
			return {
				logs: logs.map(x => x.value).join("\n"),
				...extras
			};
		}

		return extras;
	}

	private writeFailure(
		message: string,
		actual: string,
		expected: string,
		fileLocation?: string,
		details?: { [props: string]: any }
	): void {
		const output = {
			message,
			severity: "fail",
			data: {
				got: actual,
				expect: expected,
				fileLocation,
				details
			}
		};

		if (output.data.details === undefined) {
			delete output.data.details;
		}

		this.writeOut(
			` ---\n${safeDump(output)
				.split("\n")
				.map(s => ` ${s}`)
				.join("\n")}...\n`
		);
	}
}
