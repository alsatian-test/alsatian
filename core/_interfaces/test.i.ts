import { ITestCase } from "./test-case.i";

export interface ITest {
  isAsync: boolean;

  ignored: boolean;
  ignoreReason?: string;

  focussed: boolean;
  timeout: number;
  key: string;
  description: string;
  testCases: Array<ITestCase>;
}
