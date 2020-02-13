import "reflect-metadata";
import {
	TestOutputStream,
} from "../alsatian-core";

import {CallbackTestRunner} from "./callback-test-runner";
import {Warner} from "../maintenance/warn";

export class TestRunner extends CallbackTestRunner {
	private readonly _outputStream: TestOutputStream;
	public get outputStream() {
		return this._outputStream;
	}

	constructor(outputStream?: TestOutputStream) {
		super();
		// If we were given a TestOutput, use it, otherwise make one
		if (outputStream !== undefined) {
			this._outputStream = outputStream;
		} else {
			this._outputStream = new TestOutputStream();
		}
		this.onTestingStarted((event) => {
			this._outputStream.emitVersion();
			this._outputStream.emitPlan(event.testSetRunInfo.testPlan.testItems.length);

		});
		this.onTestFixtureStarted((event) => {
			this._outputStream.emitFixture(event.testFixture);
		});
		this.onWarning((event) => {
			this.outputStream.emitWarning(event.warning);
		});
		this.onTestingComplete((event) => {
			this._outputStream.end();
		});
		this.onTestComplete((event) => {

			this._outputStream.emitResult(
				event.testId, event.testCaseResult
			);
		});
	}
}
