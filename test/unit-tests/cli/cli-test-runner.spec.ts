import { CliTestRunner } from "../../../cli/cli-test-runner";
import { AlsatianCliOptions } from "../../../cli/alsatian-cli-options";
import { TestFixtureBuilder } from "../../builders/test-fixture-builder";
import { TestBuilder } from "../../builders/test-builder";
import { TestCaseBuilder } from "../../builders/test-case-builder";
import { Expect, AsyncTest, TestCase, SpyOn, Setup, Teardown, TestSet, TestOutcome, TestRunner } from "../../../core/alsatian-core";
import { Promise } from "../../../promise/promise";

export class CliTestRunnerTests {

   private _originalStdErr: any;
   private _originalStdOut: any;
   private _originalProcessExit: any;

   @Setup
   private _spyProcess() {
      this._originalProcessExit = process.exit;
      this._originalStdOut = process.stdout.write;
      this._originalStdErr = process.stderr.write;

      SpyOn(process, "exit").andStub();
      SpyOn(process.stderr, "write").andStub();
      SpyOn(process.stdout, "write").andStub();
   }

   @Teardown
   private _resetProcess() {
      process.exit = this._originalProcessExit;
      process.stdout.write = this._originalStdOut;
      process.stderr.write = this._originalStdErr;
   }

   @TestCase(null)
   @TestCase(undefined)
   public nullOrUndefinedTestRunnerThrowsError(testRunner: TestRunner) {
      Expect(() => new CliTestRunner(testRunner)).toThrowError(TypeError, "_testRunner must not be null or undefined.");
   }

   @AsyncTest()
   public noTestFixturesExitsWithError() {

      return new Promise<void>((resolve, reject) => {

         const cliTestRunner = new CliTestRunner(new TestRunner());

         const cliOptions = new AlsatianCliOptions([]);

         cliTestRunner.run(cliOptions);

         setTimeout(() => {
            try {
               Expect(process.exit).toHaveBeenCalledWith(1);
               resolve();
            }
            catch (error) {
               reject(error);
            }
         });
      });
   }

   @AsyncTest()
   public noTestFixturesPrintsErrorMessageWithNewLine() {
      return new Promise<void>((resolve, reject) => {

         const cliTestRunner = new CliTestRunner(new TestRunner());

         const cliOptions = new AlsatianCliOptions([]);

         cliTestRunner.run(cliOptions);

         setTimeout(() => {
            try {
               Expect(process.stderr.write).toHaveBeenCalledWith("no tests to run.\n");
               resolve();
            }
            catch (error) {
               reject(error);
            }
         });
      });
   }

   @AsyncTest()
   public onePassingTestFixturesExitsWithNoError() {

      return new Promise<void>((resolve, reject) => {

         const testRunner = new TestRunner();

         const cliTestRunner = new CliTestRunner(testRunner);

         const testRunnerRunSpy = SpyOn(testRunner, "run");
         testRunnerRunSpy.andReturn(new Promise((resolve, reject) => { resolve(); }));
         testRunnerRunSpy.andStub();

         const cliOptions = new AlsatianCliOptions([]);

         cliTestRunner.run(cliOptions);

         setTimeout(() => {
            try {
               Expect(process.exit).not.toHaveBeenCalledWith(1);
               resolve();
            }
            catch (error) {
               console.log((process.exit as any).calls);
               reject(error);
            }
         });
      });
   }

   @AsyncTest()
   public runThrowsErrorExitsWithError(outcome: TestOutcome) {

      return new Promise<void>((resolve, reject) => {
         const testRunner = new TestRunner();

         const cliTestRunner = new CliTestRunner(testRunner);

         const testRunnerRunSpy = SpyOn(testRunner, "run");
         testRunnerRunSpy.andCall(() => { throw new Error(); });

         const cliOptions = new AlsatianCliOptions([]);

         cliTestRunner.run(cliOptions);

         setTimeout(() => {
            try {
               Expect(process.exit).toHaveBeenCalledWith(1);
               resolve();
            }
            catch (error) {
               reject(error);
            }
         });
      });
   }

   @TestCase("something bad")
   @TestCase("another even worse thing")
   @TestCase("awfully terrible")
   @AsyncTest()
   public runThrowsErrorOutputsErrorMessage(errorMessage: string) {

      return new Promise<void>((resolve, reject) => {
         const testRunner = new TestRunner();

         const cliTestRunner = new CliTestRunner(testRunner);

         const testRunnerRunSpy = SpyOn(testRunner, "run");
         testRunnerRunSpy.andCall(() => { throw new Error(errorMessage); });

         const cliOptions = new AlsatianCliOptions([]);

         cliTestRunner.run(cliOptions);

         setTimeout(() => {
            try {
               Expect(process.stderr.write).toHaveBeenCalledWith(errorMessage + "\n");
               resolve();
            }
            catch (error) {
               reject(error);
            }
         });
      });
   }

   @AsyncTest()
   public tapRequestedPipesOutputDirectlyToProcessStdOut() {

      return new Promise<void>((resolve, reject) => {

         const testRunner = new TestRunner();
         SpyOn(testRunner.outputStream, "pipe");

         const cliTestRunner = new CliTestRunner(testRunner);

         const testRunnerRunSpy = SpyOn(testRunner, "run");
         testRunnerRunSpy.andReturn(new Promise((resolve, reject) => { resolve(); }));
         testRunnerRunSpy.andStub();

         const cliOptions = new AlsatianCliOptions([ "--tap" ]);

         cliTestRunner.run(cliOptions);

         setTimeout(() => {
            try {
               Expect(testRunner.outputStream.pipe).toHaveBeenCalledWith(process.stdout);
               resolve();
            }
            catch (error) {
               reject(error);
            }
         });
      });
   }

   @AsyncTest()
   public tapRequestedWithAliasPipesOutputDirectlyToProcessStdOut() {

      return new Promise<void>((resolve, reject) => {

         const testRunner = new TestRunner();
         SpyOn(testRunner.outputStream, "pipe");

         const cliTestRunner = new CliTestRunner(testRunner);

         const testRunnerRunSpy = SpyOn(testRunner, "run");
         testRunnerRunSpy.andReturn(new Promise((resolve, reject) => { resolve(); }));
         testRunnerRunSpy.andStub();

         const cliOptions = new AlsatianCliOptions([ "-T" ]);

         cliTestRunner.run(cliOptions);

         setTimeout(() => {
            try {
               Expect(testRunner.outputStream.pipe).toHaveBeenCalledWith(process.stdout);
               resolve();
            }
            catch (error) {
               reject(error);
            }
         });
      });
   }

   @AsyncTest()
   public versionRequestedOutputsCurrentVersionNumber() {

      return new Promise<void>((resolve, reject) => {

         const testRunner = new TestRunner();
         SpyOn(testRunner.outputStream, "pipe");

         const cliTestRunner = new CliTestRunner(testRunner);

         SpyOn(testRunner, "run");

         const cliOptions = new AlsatianCliOptions([ "--version" ]);

         cliTestRunner.run(cliOptions);

         setTimeout(() => {
            try {
               Expect(process.stdout.write).toHaveBeenCalledWith("alsatian version " + require("../../../package.json").version);
               resolve();
            }
            catch (error) {
               reject(error);
            }
         });
      });
   }

   @AsyncTest()
   public versionRequestedWithAliasOutputsCurrentVersionNumber() {

      return new Promise<void>((resolve, reject) => {

         const testRunner = new TestRunner();
         SpyOn(testRunner.outputStream, "pipe");

         const cliTestRunner = new CliTestRunner(testRunner);

         SpyOn(testRunner, "run");

         const cliOptions = new AlsatianCliOptions([ "-v" ]);

         cliTestRunner.run(cliOptions);

         setTimeout(() => {
            try {
               Expect(process.stdout.write).toHaveBeenCalledWith("alsatian version " + require("../../../package.json").version);
               resolve();
            }
            catch (error) {
               reject(error);
            }
         });
      });
   }

   @AsyncTest()
   public versionRequestedDoesntCallTestRunnerRun() {

      return new Promise<void>((resolve, reject) => {

         const testRunner = new TestRunner();
         SpyOn(testRunner.outputStream, "pipe");

         const cliTestRunner = new CliTestRunner(testRunner);

         SpyOn(testRunner, "run");

         const cliOptions = new AlsatianCliOptions([ "--version" ]);

         cliTestRunner.run(cliOptions);

         setTimeout(() => {
            try {
               Expect(testRunner.run).not.toHaveBeenCalled();
               resolve();
            }
            catch (error) {
               reject(error);
            }
         });
      });
   }

   @AsyncTest()
   public versionRequestedWithAliasPipesOutputDirectlyToProcessStdOut() {

      return new Promise<void>((resolve, reject) => {

         const testRunner = new TestRunner();
         SpyOn(testRunner.outputStream, "pipe");

         const cliTestRunner = new CliTestRunner(testRunner);

         SpyOn(testRunner, "run");

         const cliOptions = new AlsatianCliOptions([ "--version" ]);

         cliTestRunner.run(cliOptions);

         setTimeout(() => {
            try {
               Expect(testRunner.run).not.toHaveBeenCalled();
               resolve();
            }
            catch (error) {
               reject(error);
            }
         });
      });
   }

   @AsyncTest()
   public helpRequestedOutputsCurrentVersionNumber() {

      return new Promise<void>((resolve, reject) => {

         const testRunner = new TestRunner();
         SpyOn(testRunner.outputStream, "pipe");

         const cliTestRunner = new CliTestRunner(testRunner);

         SpyOn(testRunner, "run");

         const cliOptions = new AlsatianCliOptions([ "--help" ]);

         cliTestRunner.run(cliOptions);

         setTimeout(() => {
            try {
               Expect(process.stdout.write).toHaveBeenCalledWith(
                  "\n\n" +
                  "alsatian version " + require("../../../package.json").version + "\n" +
                  "=========================\n" +
                  "CLI options\n" +
                  "=========================\n" +
                  "HELP:    --help / -h                      (outputs CLI information)\n" +
                  "VERSION: --version / -v                   (outputs the version of the CLI)\n" +
                  "TAP:     --tap / -T                       (runs alsatian with TAP output)\n" +
                  "TIMEOUT: --timeout [number] / -t [number] (sets the timeout period for tests in milliseconds - default 500)\n" +
                  "\n");

               resolve();
            }
            catch (error) {
               reject(error);
            }
         });
      });
   }

   @AsyncTest()
   public helpRequestedWithAliasOutputsCurrentVersionNumber() {

      return new Promise<void>((resolve, reject) => {

         const testRunner = new TestRunner();
         SpyOn(testRunner.outputStream, "pipe");

         const cliTestRunner = new CliTestRunner(testRunner);

         SpyOn(testRunner, "run");

         const cliOptions = new AlsatianCliOptions([ "-h" ]);

         cliTestRunner.run(cliOptions);

         setTimeout(() => {
            try {
               Expect(process.stdout.write).toHaveBeenCalledWith(
                  "\n\n" +
                  "alsatian version " + require("../../../package.json").version + "\n" +
                  "=========================\n" +
                  "CLI options\n" +
                  "=========================\n" +
                  "HELP:    --help / -h                      (outputs CLI information)\n" +
                  "VERSION: --version / -v                   (outputs the version of the CLI)\n" +
                  "TAP:     --tap / -T                       (runs alsatian with TAP output)\n" +
                  "TIMEOUT: --timeout [number] / -t [number] (sets the timeout period for tests in milliseconds - default 500)\n" +
                  "\n");

               resolve();
            }
            catch (error) {
               reject(error);
            }
         });
      });
   }

   @AsyncTest()
   public helpRequestedDoesntCallTestRunnerRun() {

      return new Promise<void>((resolve, reject) => {

         const testRunner = new TestRunner();
         SpyOn(testRunner.outputStream, "pipe");

         const cliTestRunner = new CliTestRunner(testRunner);

         SpyOn(testRunner, "run");

         const cliOptions = new AlsatianCliOptions([ "--help" ]);

         cliTestRunner.run(cliOptions);

         setTimeout(() => {
            try {
               Expect(testRunner.run).not.toHaveBeenCalled();
               resolve();
            }
            catch (error) {
               reject(error);
            }
         });
      });
   }

   @AsyncTest()
   public helpRequestedWithAliasPipesOutputDirectlyToProcessStdOut() {

      return new Promise<void>((resolve, reject) => {

         const testRunner = new TestRunner();
         SpyOn(testRunner.outputStream, "pipe");

         const cliTestRunner = new CliTestRunner(testRunner);

         SpyOn(testRunner, "run");

         const cliOptions = new AlsatianCliOptions([ "-h" ]);

         cliTestRunner.run(cliOptions);

         setTimeout(() => {
            try {
               Expect(testRunner.run).not.toHaveBeenCalled();
               resolve();
            }
            catch (error) {
               reject(error);
            }
         });
      });
   }
}
