import { TestRunner, TestSet, TestSetResults, TestOutcome } from "../core/alsatian-core";
import { createPromise } from "../promise/create-promise";

export class CliTestRunner extends TestRunner {

  public run(testSet: TestSet) {

    try {
       let testRunPromise = super.run(testSet);

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
       process.stderr.write(error.message);
       process.exit(1);
    }
  }
}
