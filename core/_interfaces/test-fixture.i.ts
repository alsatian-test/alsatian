import { ITest } from "./test.i";

export interface ITestFixture {
  fixture: Object;
  ignored: boolean;
  focussed: boolean;
  tests: Array<ITest>;
}
