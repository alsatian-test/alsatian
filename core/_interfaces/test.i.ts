import { ITestCase } from "./test-case.i";

export interface ITest {
  isAsync: boolean;
  key: string;
  testCases: Array<ITestCase>;
}
