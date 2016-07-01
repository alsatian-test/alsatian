import { TestRunner } from "../../../core/test-runner";
import { TestSet } from "../../../core/test-set";
import { Expect, Test, TestCase, SpyOn, Setup, Teardown } from "../../../core/alsatian-core";

export class TapVersionTests {

   private _originalProcessExit: any;
   private _originalProcessStdOutWrite: any;

   @Setup
   private _spyOnProcessFunctions() {
      this._originalProcessExit = process.exit;
      this._originalProcessStdOutWrite = process.stdout.write;

      SpyOn(process, "exit").andStub();
      SpyOn(process.stdout, "write").andStub();
   }

   @Teardown
   private _returnProcessFunctions() {
      process.exit = this._originalProcessExit;
      process.stdout.write = this._originalProcessStdOutWrite;
   }

   @Test()
   public emptyTestFixturesExitsWithCodeOne() {
      let testSet = <TestSet>{};

      (<any>testSet).testFixtures = [ {
         tests: [{
            testCases: []
         }]
      }];

      let testRunner = new TestRunner();

      testRunner.run(testSet);

      Expect(process.stdout).toHaveBeenCalledWith("TAP version 131\n");
   }
}
