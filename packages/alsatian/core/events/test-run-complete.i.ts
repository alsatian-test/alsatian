import {TestSetRunInfo} from "../running";
import {TestSetResults} from "../results";

export interface ITestRunCompleteEvent {
	testSetRunInfo: TestSetRunInfo;
	testSetResults: TestSetResults;
}
