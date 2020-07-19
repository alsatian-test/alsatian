import { ITestCase } from "./test-case.i";

export interface ITest {
	isAsync: boolean;

	ignored: boolean;
	ignoreReason?: string;

	focussed: boolean;
	timeout: number | null;
	key: string;
	description: string;
	testCases: Array<ITestCase>;
}
