import { TestRunner } from "../../../core/test-runner";
import { TestSet } from "../../../core/test-set";
import { Expect, Test, TestCase, SpyOn, Setup, Teardown, FocusTest, IgnoreTest } from "../../../core/alsatian-core";

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

   @Test()
   @FocusTest
   public asyncTestRunsSucessfully() {
      let testSet = <TestSet>{};

      let promise: any = {
         then: (callback: any) => {
            promise.resolve = callback;
            return promise;
         },
         catch: () => {
            return promise;
         }
      };

      (<any>testSet).testFixtures = [ { tests: [ {
         isAsync: true,
         key: "testFunction",
         testCases: [ {
            arguments: []
         } ]
      }],
      fixture: {
         testFunction: () => {
            setTimeout(() => {
                     Expect(process.stdout.write).toHaveBeenCalledWith("ok 1 - testFunction\n");
                     promise.resolve();
                   }, 100);
            return promise;
         }
      }}];

      let testRunner = new TestRunner();

      testRunner.run(testSet);

   }
}
