import {ITestFixture} from "../_interfaces";

export interface ITestFixtureStartedEvent {
	testFixture: ITestFixture;
}

export type IOnTestFixtureStartedCBFunction = (
	testFixtureStarted: ITestFixtureStartedEvent
) => void;
