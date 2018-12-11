import { ITest } from "./test.i";

export interface ITestFixture {
	fixture: { [id: string]: (...args: Array<any>) => any };

	ignored: boolean;
	ignoreReason: string;

	focussed: boolean;
	tests: Array<ITest>;

	description: string;

	filePath: string;
	addTest(test: ITest): void;
}
