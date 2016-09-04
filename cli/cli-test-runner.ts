import { TestRunner, TestSet, TestSetResults, TestOutcome } from "../core/alsatian-core";

export class CliTestRunner {

   private _testRunner = new TestRunner();

   public run(testSet: TestSet, timeout?: number) {

      try {
         let testRunPromise = this._testRunner.run(testSet, timeout);

         testRunPromise.then((results: TestSetResults) => {
            if (results.outcome === TestOutcome.Error || results.outcome === TestOutcome.Fail) {
               process.exit(1);
            }
            else {
               process.exit(0);
            }
         });
      }
      catch (error) {
         process.stderr.write(error.message + "\n");
         process.exit(1);
      }
   }
}
