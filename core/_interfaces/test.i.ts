import { ITestCase } from "./test-case.i";

export interface ITest {
  isAsync: boolean;
  ignored: boolean;
  focussed: boolean;
  key: string;
  description: string;
  testCases: Array<ITestCase>;
}
