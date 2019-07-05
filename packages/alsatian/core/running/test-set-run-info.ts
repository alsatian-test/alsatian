import { TestSetResults } from "../alsatian-core";
import { TestItem } from "./test-item";
import { TestPlan } from "./test-plan";

export class TestSetRunInfo {

	private _testPlanItem: TestItem;
	public get testPlanItem() {
		return this._testPlanItem;
	}

	public set testPlanItem(testPlanItem: TestItem) {
		if (testPlanItem) {
			this._testPlanItem = testPlanItem;
		} else {
			throw new TypeError("testPlanItem must not be null or undefined.");
		}
	}

	public constructor(
		public readonly testPlan: TestPlan,
		public readonly testSetResults: TestSetResults,
		public readonly timeout: number
	) {}
}
