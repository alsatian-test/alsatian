import { TestSetResults } from "../alsatian-core";
import { TestItem } from "./test-item";
import { TestPlan } from "./test-plan";

export class TestSetRunInfo {
	public get timeout() {
		return this._timeout;
	}

	public get testPlan() {
		return this._testPlan;
	}

	public get testSetResults() {
		return this._testSetResults;
	}

	public constructor(
		private _testPlan: TestPlan,
		private _testSetResults: TestSetResults,
		private _timeout: number
	) {}
}
