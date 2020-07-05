import { TestSetResults } from "../alsatian-core";
import { TestItem } from "./test-item";
import { TestPlan } from "./test-plan";

export class TestSetRunInfo {
	public constructor(
		public readonly testPlan: TestPlan,
		public readonly testSetResults: TestSetResults,
		public readonly timeout: number
	) {}
}
