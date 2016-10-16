import { AlsatianCliOptions } from "./alsatian-cli-options";
import { TestRunner, TestSet, TestSetResults, TestOutcome, TestOutputStream } from "../core/alsatian-core";
const { TapBark } = require("tap-bark");

export class CliTestRunner {

   public constructor(private _testRunner: TestRunner) {
      if (!_testRunner) {
         throw new TypeError("_testRunner must not be null or undefined.");
      }
   }

   public static create(): CliTestRunner {
      const outputStream = new TestOutputStream();
      const testRunner = new TestRunner(outputStream);
      return new CliTestRunner(testRunner);
   }

   public run(userArguments: AlsatianCliOptions) {

      // create test set from given file globs
      const testSet = TestSet.create();
      testSet.addTestsFromFiles(userArguments.fileGlobs);

      if (userArguments.tap) {
         // if they want TAP output then just write to stdout directly
         this._testRunner.outputStream.pipe(process.stdout);
      }
      else {
         // otherwise create the tap bark reporter
         const bark = TapBark.create();

         // pipe the reporter into stdout
         this._testRunner.outputStream.pipe(bark.getPipeable()).pipe(process.stdout);
      }

      try {
         const testRunPromise = this._testRunner.run(testSet, userArguments.timeout);

         testRunPromise.catch(this._handleTestSetRunError);
      }
      catch (error) {
         this._handleTestSetRunError(error);
      }
   }

   private _handleTestSetRunError(error: Error)  {
      process.stderr.write(error.message + "\n");
      process.exit(1);
   }
}
