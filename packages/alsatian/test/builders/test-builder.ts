import { ITestCase } from "../../core/_interfaces/test-case.i";
import { ITest } from "../../core/_interfaces/test.i";
import { TestCaseBuilder } from "./test-case-builder";

export class TestBuilder {
	private _test: ITest;

	public constructor() {
		this._test = {
			description: "Test Function",
			focussed: false,
			ignoreReason: undefined,
			ignored: false,
			isAsync: false,
			key: "testFunction",
			testCases: [],
			timeout: null
		};
	}

	public withIsAsync(isAsync: boolean): TestBuilder {
		this._test.isAsync = isAsync;
		return this;
	}

	public withKey(key: string): TestBuilder {
		this._test.key = key;
		return this;
	}

	public withDescription(description: string): TestBuilder {
		this._test.description = description;
		return this;
	}

	public addTestCase(testCase: ITestCase): TestBuilder {
		this._test.testCases.push(testCase);
		return this;
	}

	public withTestCases(testCases: Array<ITestCase>): TestBuilder {
		this._test.testCases = testCases;
		return this;
	}

	public withTestCaseCount(testCaseCount: number): TestBuilder {
		for (let i = 0; i < testCaseCount; i++) {
			this._test.testCases.push(new TestCaseBuilder().build());
		}

		return this;
	}

	public ignored(reason?: string): TestBuilder {
		this._test.ignored = true;
		this._test.ignoreReason = reason;
		return this;
	}

	public focussed(): TestBuilder {
		this._test.focussed = true;
		return this;
	}

	public build(): ITest {
		return this._test;
	}
}
