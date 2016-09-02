import { TestRunner } from "../../../core/test-runner";
import { TestSet } from "../../../core/test-set";
import { Expect, AsyncTest, TestCase, SpyOn, Setup, Teardown, FocusTest, IgnoreTest } from "../../../core/alsatian-core";
import { Promise } from "../../../promise/promise";

export class AsyncTestTests {

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

   @AsyncTest()
   @IgnoreTest("TextFixture should be constructed with the builder")
   public asyncTestRunsSucessfully() {
      let testSet = <TestSet>{};

      return new Promise<void>((resolve, reject) => {

         (<any>testSet).testFixtures = [ { tests: [ {
            description: "Test Function",
            isAsync: true,
            key: "testFunction",
            testCases: [ {
               arguments: []
            } ]
         }],
         fixture: {
            testFunction: () => {
               return new Promise((subresolve, subreject) => {
                  setTimeout(() => {
                     subresolve();
                     Expect(process.stdout.write).toHaveBeenCalledWith("ok 1 Test Function\n");
                     resolve();
                  }, 100);
               });
            }
         }}];

         let testRunner = new TestRunner();

         testRunner.run(testSet);

      });
   }

   @AsyncTest()
   @IgnoreTest("TextFixture should be constructed with the builder")
   public asyncTestTimeoutFails() {
      let testSet = <TestSet>{};

      return new Promise<void>((resolve, reject) => {

         (<any>testSet).testFixtures = [ { tests: [ {
            description: "Test Function",
            isAsync: true,
            timeout: 100,
            key: "testFunction",
            testCases: [ {
               arguments: []
            } ]
         }],
         fixture: {
            testFunction: () => {
               return new Promise((subresolve, subreject) => {
                  setTimeout(() => {
                     subresolve();
                     Expect(process.stdout.write).toHaveBeenCalledWith("not ok 1 Test Function\n");
                     resolve();
                  }, 101);
               });
            }
         }}];

         let testRunner = new TestRunner();

         testRunner.run(testSet);

      });
   }
}
