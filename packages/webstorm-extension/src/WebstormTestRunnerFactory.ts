import { Interface } from "readline";
import { WebstormPluginRestClient } from "./WebstormPluginRestClient";
import { CallbackTestRunner } from "alsatian";
import { ITest, ITestFixture } from "alsatian/dist/core/_interfaces";
import {
	ITestCompleteEvent,
	ITestFixtureCompleteEvent,
	ITestFixtureStartedEvent,
	ITestStartedEvent
} from "alsatian/dist/core/events";


export class WebstormTestRunnerFactory {
	private readonly webstormPluginRestClient: WebstormPluginRestClient;

	constructor(webstormPluginRestClient: WebstormPluginRestClient) {
		this.webstormPluginRestClient = webstormPluginRestClient;

	}

	createTestRunner(readerInterface: Interface): CallbackTestRunner {
		let currentFixture: ITestFixture;
		let currentTest: ITest;
		let testStartTime: Date;

		const webstormPluginRestClient = this.webstormPluginRestClient;
		readerInterface.on("line", async function(line) {
			await webstormPluginRestClient.sendConsoleOutput(currentTest, line);
		});

		let testRunner = new CallbackTestRunner();
		testRunner.onWarning(async (event: any) => {
			await this.webstormPluginRestClient.sendWarning(currentTest, event);
		});
		testRunner.onTestStarted(async (event: ITestStartedEvent) => {
			testStartTime = new Date();
			currentTest = event.test;
			currentFixture = event.testFixture;
			await webstormPluginRestClient.sendTestStarted(event);
		});

		testRunner.onTestFixtureStarted(async (event: ITestFixtureStartedEvent) => {
			await this.webstormPluginRestClient.sendTestFixtureStarted(event);
		});

		testRunner.onTestComplete(async (event: ITestCompleteEvent) => {
			let executionTime = (new Date().getMilliseconds() - testStartTime.getMilliseconds());
			let reportedError: any = null;
			if (event.testCaseResult.error) {
				reportedError = {
					message: event.testCaseResult.error.message,
					stack: event.testCaseResult.error.stack
				};
			}
			await webstormPluginRestClient.sendTestComplete(event, reportedError, executionTime);
		});

		testRunner.onTestFixtureComplete(async (event: ITestFixtureCompleteEvent) => {
			await webstormPluginRestClient.sendTestFixtureComplete(event);
		});
		return testRunner;
	}

}
