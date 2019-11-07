import {ITestFixture} from "../_interfaces";
import {TestFixtureResults} from "../results";

export interface ITestFixtureCompleteEvent {
	testFixture: ITestFixture;
	testFixtureResults: TestFixtureResults;
}

export type IOnTestFixtureCompleteCBFunction = (
	testFixtureComplete: ITestFixtureCompleteEvent
) => void;
