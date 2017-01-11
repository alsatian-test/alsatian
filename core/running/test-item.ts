import { Promise } from "../../promise/promise";
import { ITest, ITestCase, ITestFixture } from "../_interfaces";
import { METADATA_KEYS } from "../alsatian-core";
import { TestTimeoutError } from "../errors";

export class TestItem {

   private _testCase: ITestCase;
   public get testCase() {
      return this._testCase;
   }

   private _test: ITest;
   public get test() {
      return this._test;
   }

   private _testFixture: ITestFixture;
   public get testFixture() {
      return this._testFixture;
   }

   public constructor(testFixture: ITestFixture, test: ITest, testCase: ITestCase) {

       if (testFixture === null || testFixture === undefined) {
           throw new TypeError("testFixture must not be null or undefined.");
       }

       if (test === null || test === undefined) {
           throw new TypeError("test must not be null or undefined.");
       }

       if (testCase === null || testCase === undefined) {
           throw new TypeError("testCase must not be null or undefined.");
       }

       this._testFixture = testFixture;
       this._test = test;
       this._testCase = testCase;
   }

   public run(timeout: number): Promise<any> {

      if (this._test.ignored) {
         return new Promise((resolve, reject) => {
            resolve({ test: this._test });
         });
      }
      else {

         this._setup();

         if (this._test.isAsync) {
            return this._runAsync(timeout);
         }
         else {
            return this._runSync();
         }
      }
   }

   private _runSync(): Promise<any> {
      return new Promise<any>((resolve, reject) => {
         try {
            this._testFixture.fixture[this._test.key].apply(this._testFixture.fixture, this._testCase.arguments);
            this._reportResult(resolve);
         }
         catch (error) {
            this._reportResult(resolve, error);
         }
      });
   }

   private _runAsync(timeout: number) {
      return new Promise<any>((resolve, reject) => {
         let timeoutExpired = false;
         let timeoutCheck: NodeJS.Timer = null;

         try {
            let testPromise: any = this._testFixture
                                       .fixture[this._test.key]
                                       .apply(this._testFixture.fixture, this._testCase.arguments);

            testPromise.then(() => {
               if (!timeoutExpired) {
                  clearTimeout(timeoutCheck);
                  this._reportResult(resolve);
               }
            })
            .catch((error: Error) => {
               clearTimeout(timeoutCheck);
               this._reportResult(resolve, error);
            });

            const testTimeout: number = this._test.timeout || timeout;

            timeoutCheck = setTimeout(() => {
               timeoutExpired = true;
               let error = new TestTimeoutError(testTimeout);
               this._reportResult(resolve, error);
            }, testTimeout);
         }
         catch (error) {
            this._reportResult(resolve, error);
         }
      });
   }

   private _reportResult(resolve: (resolvedValue: any) => any, error?: Error) {
      this._teardown();
      resolve({
          error: error,
          test: this._test
      });
   }

   private _setup() {
      let setupFunctions: Array<string> = Reflect.getMetadata(METADATA_KEYS.SETUP, this._testFixture.fixture);

      if (setupFunctions) {
         setupFunctions.forEach(setupFunction => {
            this._testFixture.fixture[setupFunction].call(this._testFixture.fixture);
         });
      }
   }

   private _teardown() {
      let teardownFunctions: Array<string> = Reflect.getMetadata(METADATA_KEYS.TEARDOWN, this._testFixture.fixture);

      if (teardownFunctions) {
         teardownFunctions.forEach(teardownFunction => {
            this._testFixture.fixture[teardownFunction].call(this._testFixture.fixture);
         });
      }
   }
}
