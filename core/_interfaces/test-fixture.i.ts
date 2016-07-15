import { ITest } from "./test.i";

export interface ITestFixture {
  fixture: Object;
  tests: Array<ITest>;
}
