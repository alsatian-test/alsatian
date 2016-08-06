import { TestRunner, TestSet } from "../core/alsatian-core";

export class CliTestRunner extends TestRunner {

  public run(testSet: TestSet) {

    try {
       let testRunPromise = super.run(testSet);

       testRunPromise.then((results: Array<any>) => {
         if (results.filter(test => test.result !== "Pass"). length > 0) {
           process.exit(1);
         }
         else {
           process.exit(0);
         }
       });

       return testRunPromise;
    }
    catch (error) {
       process.stderr.write(error.message);
       process.exit(1);
    }
  }
}
