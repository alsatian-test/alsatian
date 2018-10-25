import { ITestCase } from "../../core/_interfaces/test-case.i";

export class TestCaseBuilder {
  private _testCase: ITestCase;

  public constructor() {
    this._testCase = {
      caseArguments: []
    };
  }

  public addArgument(argument: any): TestCaseBuilder {
    this._testCase.caseArguments.push(argument);
    return this;
  }

  public withArguments(args: Array<any>): TestCaseBuilder {
    this._testCase.caseArguments = args;
    return this;
  }

  public withArgumentCount(argumentCount: number): TestCaseBuilder {
    for (let i = 0; i < argumentCount; i++) {
      this._testCase.caseArguments.push(0);
    }
    return this;
  }

  public build(): ITestCase {
    return this._testCase;
  }
}
