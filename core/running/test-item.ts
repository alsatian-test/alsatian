import { ITestFixture, ITest, ITestCase } from "../_interfaces";
import { METADATA_KEYS } from "../alsatian-core";
import { createPromise } from "../../promise/create-promise";
import { TestTimeoutError } from "../_errors";

export class TestItem {

   public get testCase() {
      return this._testCase;
   }

   public get test() {
      return this._test;
   }

   public get testFixture() {
      return this._testFixture;
   }

   public constructor(private _testFixture: ITestFixture, private _test: ITest, private _testCase: ITestCase) {}

   public run(timeout: number): any {

      const promise = createPromise();
      setTimeout(() => this._run(promise, timeout));
      return promise;
   }

   private _run(promise: any, timeout: number) {

      if (this._test.ignored) {
         promise.resolve({ test: this._test });
      }
      else {

         this._setup();

         if (this._test.isAsync) {
            this._runAsync(promise, timeout);
         }
         else {
            this._runSync(promise);
         }
      }
   }

   private _runSync(promise: any) {
      try {
         this._testFixture.fixture[this._test.key].apply(this._testFixture.fixture, this._testCase.arguments);
         this._tearDown();
         promise.resolve({ test: this._test });
      }
      catch (error) {
         this._tearDown();
         promise.resolve({ test: this._test, error: error });
      }
   }

   private _runAsync(promise: any, timeout: number) {
      let timeoutExpired = false;

      let testPromise: any = this._testFixture.fixture[this._test.key].apply(this._testFixture.fixture, this._testCase.arguments);
      let timeoutCheck: NodeJS.Timer = null;

      testPromise.then(() => {
         if (!timeoutExpired) {
            clearTimeout(timeoutCheck);
            this._tearDown();
            promise.resolve({ test: this._test });
         }
      })
      .catch((error: Error) => {
         console.log(error);
         clearTimeout(timeoutCheck);
         this._tearDown();
         promise.resolve({ test: this._test, error: error });
      });

      const testTimeout: number = this._test.timeout || timeout;

      timeoutCheck = setTimeout(() => {
         timeoutExpired = true;
         let error = new TestTimeoutError(testTimeout);
         this._tearDown();
         promise.resolve({ test: this._test, error: error });
      }, testTimeout);
   }

   private _reportResult(promise: any, error?: Error) {
      this._tearDown();
      promise.resolve({ test: this._test, error: error });
   }

   private _setup() {
      let setupFunctions: Array<string> = Reflect.getMetadata(METADATA_KEYS.SETUP, this._testFixture.fixture);

      if (setupFunctions) {
         setupFunctions.forEach(setupFunction => {
            this._testFixture.fixture[setupFunction].call(this._testFixture.fixture);
         });
      }
   }

   private _tearDown() {
      let teardownFunctions: Array<string> = Reflect.getMetadata(METADATA_KEYS.TEARDOWN, this._testFixture.fixture);

      if (teardownFunctions) {
         teardownFunctions.forEach(teardownFunction => {
            this._testFixture.fixture[teardownFunction].call(this._testFixture.fixture);
         });
      }
   }
}
