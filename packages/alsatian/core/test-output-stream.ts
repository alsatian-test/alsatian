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
		this._writeOut("TAP version 13\n");
	}

	public emitPlan(testCount: number): void {
		this._writeOut(`1..${testCount}\n`);
	}

	public emitFixture(fixture: ITestFixture): void {
		this._writeOut(`# FIXTURE ${fixture.description}\n`);
	}

	public emitLog(...logs: Array<string>): void {
		this._writeLogs(logs, "LOG");
	}

	public emitWarning(...warnings: Array<string>): void {
		this._writeLogs(warnings, "WARN");
	}

	public emitResult(testId: number, result: TestCaseResult): void {
		const outcome = result.outcome;

		if (outcome === TestOutcome.Pass) {
			this._emitPass(testId, result);
		} else if (
			outcome === TestOutcome.Fail ||
			outcome === TestOutcome.Error
		) {
			this._emitFail(testId, result);
		} else if (outcome === TestOutcome.Skip) {
			this._emitSkip(testId, result);
		} else {
			throw new TypeError(`Invalid test outcome: ${outcome}`);
		}
	}

	private _writeLogs(logs: Array<string>, level: string) {
		this._writeOut(`# ${level}: ${logs.join(" ")}\n`);
	}

	private _writeOut(message: string): void {
		this.push(message);
	}

	private _emitPass(testId: number, result: TestCaseResult): void {
		this._writeOut(`ok ${testId} ${result.description}\n`);
	}

	private _emitSkip(testId: number, result: TestCaseResult): void {
		const test = result.testResults.test;

		const reasonString = test.ignoreReason ? ` ${test.ignoreReason}` : "";

		this._writeOut(
			`ok ${testId} ${result.description} # skip${reasonString}\n`
		);
	}

	private _emitFail(testId: number, result: TestCaseResult): void {
		this._writeOut(`not ok ${testId} ${result.description}\n`);

		if (result.error && result.error.name === MatchError.name) {
			this._writeMatchErrorOutput(result.error as MatchError, result.logs);
		} else {
			this._writeUnhandledErrorOutput(result.error, result.logs);
		}
	}

	private _writeMatchErrorOutput(error: MatchError, logs: Array<ILog>): void {
		const sanitisedMessage = error.message
			.replace(/\\/g, "\\\\")
			.replace(/"/g, '\\"');
		const sanitisedActual = stringify(error.actual);
		const sanitisedExpected = stringify(error.expected);

		this._writeFailure(
			sanitisedMessage,
			sanitisedActual,
			sanitisedExpected,
			this.extrasWithLogs(error.extras, logs)
		);
	}

	private _writeUnhandledErrorOutput(
		error: Error | null,
		logs: Array<ILog>
	): void {
		this._writeFailure(
			"The test threw an unhandled error.",
			"an unhandled error",
			"no unhandled errors to be thrown",
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

	private _writeFailure(
		message: string,
		actual: string,
		expected: string,
		details?: { [props: string]: any }
	): void {
		const output = {
			message,
			severity: "fail",
			data: {
				got: actual,
				expect: expected,
				details
			}
		};

		if (output.data.details === undefined) {
			delete output.data.details;
		}

		this._writeOut(
			` ---\n${safeDump(output)
				.split("\n")
				.map(s => ` ${s}`)
				.join("\n")}...\n`
		);
	}
}
