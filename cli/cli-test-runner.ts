import { AlsatianCliOptions } from "./alsatian-cli-options";
import { TestRunner, TestSet, TestSetResults, TestOutcome, TestOutputStream } from "../core/alsatian-core";
import { TapBark } from "tap-bark";
const Package = require("../package.json");

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

      // if version has been requested then output the current version and exit
      if (userArguments.versionRequested) {
         process.stdout.write("alsatian version " + Package.version);
         return;
      }

      // if help has been requested then output info about using the CLI and exit
      if (userArguments.helpRequested) {
         process.stdout.write("\n\n" +
                              "alsatian version " + Package.version + "\n" +
                              "=========================\n" +
                              "CLI options\n" +
                              "=========================\n" +
                              "HELP:    --help / -h                      (outputs CLI information)\n" +
                              "VERSION: --version / -v                   (outputs the version of the CLI)\n" +
                              "TAP:     --tap / -T                       (runs alsatian with TAP output)\n" +
                              "TIMEOUT: --timeout [number] / -t [number] (sets the timeout period for tests in milliseconds - default 500)\n" +
                              "\n"
                              );
         return;
      }

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

   private _handleTestSetRunError(error: Error) {
      process.stderr.write(error.message + "\n");
      process.exit(1);
   }
}
