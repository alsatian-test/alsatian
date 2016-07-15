import { TestRunner } from "../../../core/test-runner";
import { TestSet } from "../../../core/test-set";
import { Expect, AsyncTest, TestCase, SpyOn, Setup, Teardown, FocusTest, IgnoreTest } from "../../../core/alsatian-core";

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

   private _createPromise() {
     let promise: any = {
        then: (callback: any) => {
           promise.resolve = callback;
           return promise;
        },
        catch: () => {
           return promise;
        }
     };

     return promise;
   }

   @AsyncTest()
   public asyncTestRunsSucessfully() {
      let testSet = <TestSet>{};

      let testPromise = this._createPromise();

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
            let subPromise = this._createPromise();
            setTimeout(() => {
                     subPromise.resolve();
                     Expect(process.stdout.write).toHaveBeenCalledWith("ok 1 - Test Function [  ]\n");
                     testPromise.resolve();
                   }, 100);
            return subPromise;
         }
      }}];

      let testRunner = new TestRunner();

      testRunner.run(testSet);

      return testPromise;

   }
}
