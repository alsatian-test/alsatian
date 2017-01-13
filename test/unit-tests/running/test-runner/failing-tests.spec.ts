import { AsyncTest, Expect, Setup, SpyOn, Teardown, TestCase } from "../../../../core/alsatian-core";
import { MatchError } from "../../../../core/errors/match-error";
import { TestRunner } from "../../../../core/running/test-runner";
import { TestOutputStream } from "../../../../core/test-output-stream";
import { TestSet } from "../../../../core/test-set";
import { Promise } from "../../../../promise/promise";
import { TestBuilder } from "../../../builders/test-builder";
import { TestCaseBuilder } from "../../../builders/test-case-builder";
import { TestFixtureBuilder } from "../../../builders/test-fixture-builder";

export class FailingTestsTests {

   private _originalStdErr: any;
   private _originalProcessExit: any;

   @Setup
   private _spyProcess() {
      this._originalProcessExit = process.exit;
      this._originalStdErr = process.stderr.write;

      SpyOn(process, "exit").andStub();
      SpyOn(process.stderr, "write").andStub();
   }

   @Teardown
   private _resetProcess() {
      process.exit = this._originalProcessExit;
      process.stderr.write = this._originalStdErr;
   }

   @AsyncTest()
   public failingTestOutputsNotOk() {
      let output = new TestOutputStream();
      SpyOn(output, "push");

      let testSet = <TestSet>{};

      (<any>testSet).testFixtures = [];
      let testFixtureBuilder = new TestFixtureBuilder();
      testFixtureBuilder.withFixture({ failingTest: () => { throw new MatchError("nothing", "something", "expected nothing to be something."); }});
      let testBuilder = new TestBuilder();
      testBuilder.withKey("failingTest");
      testBuilder.addTestCase(new TestCaseBuilder().build());
      testFixtureBuilder.addTest(testBuilder.build());
      testSet.testFixtures.push(testFixtureBuilder.build());

      return new Promise<void>((resolve, reject) => {

         let testRunner = new TestRunner(output);

         testRunner.run(testSet).then(() => {
            Expect(output.push).toHaveBeenCalledWith("not ok 1 Test Function\n");
            resolve();
         })
         .catch((error: Error) => {
            reject(error);
         });
      });
   }

   @AsyncTest()
   public testThrowsErrorOutputsNotOk() {
      let output = new TestOutputStream();
      SpyOn(output, "push");

      let testSet = <TestSet>{};

      (<any>testSet).testFixtures = [];
      let testFixtureBuilder = new TestFixtureBuilder();
      testFixtureBuilder.withFixture({ failingTest: () => { throw new Error("something went wrong."); }});
      let testBuilder = new TestBuilder();
      testBuilder.withKey("failingTest");
      testBuilder.addTestCase(new TestCaseBuilder().build());
      testFixtureBuilder.addTest(testBuilder.build());

      testSet.testFixtures.push(testFixtureBuilder.build());

      return new Promise<void>((resolve, reject) => {

         let testRunner = new TestRunner(output);

         testRunner.run(testSet).then(() => {
            Expect(output.push).toHaveBeenCalledWith("not ok 1 Test Function\n");
            resolve();
         })
         .catch((error: Error) => {
            reject(error);
         });
      });
   }
}
