import { ITestCase } from "./test-case.i";
import { TestItem } from "../running";

export interface ITest {
   ignored: boolean;
   ignoreReason?: string;

   focussed: boolean;
   timeout: number;
   key: string;
   description: string;
   testCases: Array<ITestCase>;
   testItems(): Iterable<TestItem>;

   addTestArguments(...args: Array<any>);
}
