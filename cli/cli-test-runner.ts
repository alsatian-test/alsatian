import { TestRunner, TestSet, TestSetResults, TestOutcome } from "../core/alsatian-core";

export class CliTestRunner {

   public constructor(private _testRunner: TestRunner) {
      if (!_testRunner) {
         throw new TypeError("_testRunner must not be null or undefined.");
      }
   }

   public run(testSet: TestSet, timeout?: number) {

      try {
         let testRunPromise = this._testRunner.run(testSet, timeout);

         testRunPromise.catch(this._handleTestSetRunError);
      }
      catch (error) {
         this._handleTestSetRunError(error);
      }
   }

   private _handleTestSetRunError(error: Error) {
      process.stderr.write(error.message + "\n");
      process.exit(1);
   }
}
