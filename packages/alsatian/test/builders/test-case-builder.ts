import { ITestCase } from "../../core/_interfaces/test-case.i";

export class TestCaseBuilder {
	private testCase: ITestCase;

	public constructor() {
		this.testCase = {
			caseArguments: []
		};
	}

	public addArgument(argument: any): TestCaseBuilder {
		this.testCase.caseArguments.push(argument);
		return this;
	}

	public withArguments(args: Array<any>): TestCaseBuilder {
		this.testCase.caseArguments = args;
		return this;
	}

	public withArgumentCount(argumentCount: number): TestCaseBuilder {
		for (let i = 0; i < argumentCount; i++) {
			this.testCase.caseArguments.push(0);
		}
		return this;
	}

	public build(): ITestCase {
		return this.testCase;
	}
}
