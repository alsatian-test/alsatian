import { ITest } from "../../core/_interfaces/test.i";
import { ITestCase } from "../../core/_interfaces/test-case.i";
import { TestCaseBuilder } from "./test-case-builder";

export class TestBuilder {

  private _test: ITest;

  public constructor() {
    this._test = {
      focussed: false,
      ignored: false,
      isAsync: false,
      timeout: null,
      key: "testFunction",
      description: "Test Function",
      testCases: [ ]
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
    let testCaseBuilder = new TestCaseBuilder();

    for (let i = 0; i < testCaseCount; i++) {
      this._test.testCases.push(testCaseBuilder.build());
    }

    return this;
  }

  public build (): ITest {
    return this._test;
  }
}
