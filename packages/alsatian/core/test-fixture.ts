import { ITest, ITestFixture } from "./_interfaces";

export class TestFixture implements ITestFixture {
	public fixture: { [id: string]: (...args: Array<any>) => any };
	public ignored: boolean;
	public ignoreReason: string;
	public focussed: boolean;
	public description: string;
	public filePath: string | undefined;

	public readonly tests: Array<ITest> = [];

	constructor(description: string) {
		this.focussed = false;
		this.ignored = false;
		this.ignoreReason = "";
		this.fixture = {};
		this.description = description;
	}

	public addTest(test: ITest): void {
		// if the test is already here, don't add it
		if (this.tests.indexOf(test) !== -1) {
			return;
		}

		this.tests.push(test);
	}
}
