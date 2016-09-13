import { CliTestRunner } from "../../../cli/cli-test-runner";
import { TestFixtureBuilder } from "../../builders/test-fixture-builder";
import { TestBuilder } from "../../builders/test-builder";
import { TestCaseBuilder } from "../../builders/test-case-builder";
import { Expect, AsyncTest, TestCase, SpyOn, Setup, Teardown, TestSet, TestRunner } from "../../../core/alsatian-core";
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
      let testSet = <TestSet>{};

      return new Promise<void>((resolve, reject) => {

         (<any>testSet).testFixtures = [ ];

         let cliTestRunner = new CliTestRunner(new TestRunner());

         cliTestRunner.run(testSet);

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
      let testSet = <TestSet>{};

      return new Promise<void>((resolve, reject) => {

         (<any>testSet).testFixtures = [ ];

         let cliTestRunner = new CliTestRunner(new TestRunner());

         cliTestRunner.run(testSet);

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
      let testSet = <TestSet>{};

      return new Promise<void>((resolve, reject) => {

         (<any>testSet).testFixtures = [
            new TestFixtureBuilder()
            .addTest(new TestBuilder().addTestCase(new TestCaseBuilder().build()).build())
            .build() ];

            let cliTestRunner = new CliTestRunner(new TestRunner());

            cliTestRunner.run(testSet);

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
      public oneErroringTestFixturesExitsWithError() {
         let testSet = <TestSet>{};

         return new Promise<void>((resolve, reject) => {

            (<any>testSet).testFixtures = [
               new TestFixtureBuilder()
               .withFixture({ "erroringTest": () => { throw new Error(); } })
               .addTest(new TestBuilder().withKey("erroringTest").build())
               .build() ];

               let cliTestRunner = new CliTestRunner(new TestRunner());

               cliTestRunner.run(testSet);

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
      }
