import { ITestCase } from "../../core/_interfaces/test-case.i";

export class TestCaseBuilder {

  private _testCase: ITestCase;

  public constructor() {
    this._testCase = {
      arguments: []
    };
  }

  public addArgument(argument: any): TestCaseBuilder {
    this._testCase.arguments.push(argument);
    return this;
  }

  public withArguments(args: Array<any>): TestCaseBuilder {
    this._testCase.arguments = args;
    return this;
  }

  public withArgumentCount(argumentCount: number): TestCaseBuilder {
    for (let i = 0; i < argumentCount; i++) {
      this._testCase.arguments.push(0);
    }
    return this;
  }

  public build (): ITestCase {
    return this._testCase;
  }
}
