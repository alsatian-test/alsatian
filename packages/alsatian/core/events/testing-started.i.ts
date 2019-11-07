import {TestSetRunInfo} from "../running";

export interface ITestingStartedEvent {
	testSetRunInfo: TestSetRunInfo;
}

export type IOnTestingStartedCBFunction = (
	testingStarted: ITestingStartedEvent
) => void;
