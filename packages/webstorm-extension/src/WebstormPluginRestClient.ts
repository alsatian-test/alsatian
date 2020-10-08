import {SimpleRestClient} from "./SimpleRestClient";
import {
    ITestCompleteEvent,
    ITestFixtureCompleteEvent,
    ITestFixtureStartedEvent,
    ITestStartedEvent,
    IWarningEvent
} from "alsatian/dist/core/events";

export class WebstormPluginRestClient {
    private readonly host: string;
    private readonly port: number;

    constructor(host: string, port: number) {
        this.host = host;
        this.port = port;
    }

    private static readonly BASE_URL = "/api/alsatiantestexecutionlistener/";
    private readonly simpleRestClient = new SimpleRestClient();

    async sendTestingFinished() {
        await this.simpleRestClient.post(this.getBaseUrl() + "testingFinished", "");
    }

    async sendConsoleOutput(currentTest: any, line:string) {
        await this.simpleRestClient.post(this.getBaseUrl() + "console?test=" + currentTest.key, line);
    }

    async sendWarning(currentTest: any, event: IWarningEvent) {
        await this.simpleRestClient.post(this.getBaseUrl() + "warnings?test=" + currentTest.key, event.warning);
    }

    async sendTestFixtureComplete(event: ITestFixtureCompleteEvent) {
        await this.simpleRestClient.post(this.getBaseUrl() + "testfixtureresult?fixture=" + event.testFixture.fixture.constructor.name, "");
    }

    async sendTestStarted(event: ITestStartedEvent) {
        await this.simpleRestClient.post(this.getBaseUrl() + "teststarted?fixture=" + event.testFixture.fixture.constructor.name + "&test=" + event.test.key, JSON.stringify({filePath: event.testFixture.filePath}));

    }

    async sendTestFixtureStarted(event: ITestFixtureStartedEvent) {
        await this.simpleRestClient.post(this.getBaseUrl() + "testfixturestarted?fixture=" + event.testFixture.fixture.constructor.name, JSON.stringify({filePath: event.testFixture.filePath}));
    }

    async sendTestComplete(event: ITestCompleteEvent, reportedError: any, executionTime: number) {
        const object: any = {
            outcome: event.testCaseResult.outcome,
            ignoreReason: event.test.ignoreReason,
            error: reportedError,
            logs: event.testCaseResult.logs,
            executionTime: executionTime
        };
        await this.simpleRestClient.post(this.getBaseUrl() + "testresult?fixture=" + event.testFixture.fixture.constructor.name + "&test=" + event.test.key, JSON.stringify(object));
    }

    private getBaseUrl() {
        return "http://" + this.host + ":" + this.port + WebstormPluginRestClient.BASE_URL;
    }

}
