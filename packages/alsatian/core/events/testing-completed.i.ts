import {TestSetRunInfo} from "../running";
import {TestSetResults} from "../results";

export interface ITestingCompleteEvent {
	testSetRunInfo: TestSetRunInfo;
	testSetResults: TestSetResults;
}
