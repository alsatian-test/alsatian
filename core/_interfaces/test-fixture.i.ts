import { ITest } from "./test.i";

export interface ITestFixture {
  fixture: { [id: string]: (...args: Array<any>) => any };
  ignored: boolean;
  focussed: boolean;
  tests: Array<ITest>;
  addTest(test: ITest): void;
  getTests(): Array<ITest>;
}
