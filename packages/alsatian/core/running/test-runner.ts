import "reflect-metadata";
import {
	TestOutputStream,
} from "../alsatian-core";

import {CallbackTestRunner} from "./callback-test-runner";

export class TestRunner extends CallbackTestRunner {
	public readonly outputStream: TestOutputStream;

	constructor(outputStream?: TestOutputStream) {
		super();
		// If we were given a TestOutput, use it, otherwise make one
		if (outputStream !== undefined) {
			this.outputStream = outputStream;
		} else {
			this.outputStream = new TestOutputStream();
		}
		this.onTestingStarted((event) => {
			this.outputStream.emitVersion();
			this.outputStream.emitPlan(event.testSetRunInfo.testPlan.testItems.length);

		});
		this.onTestFixtureStarted((event) => {
			this.outputStream.emitFixture(event.testFixture);
		});
		this.onWarning((event) => {
			this.outputStream.emitWarning(event.warning);
		});
		this.onTestingComplete((event) => {
			this.outputStream.end();
		});
		this.onTestComplete((event) => {
			this.outputStream.emitResult(
				event.testId, event.testCaseResult
			);
		});
	}
}
