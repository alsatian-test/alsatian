import { TestRunner } from "../../../core/test-runner";
import { TestSet } from "../../../core/test-set";
import { TestFixtureBuilder } from "../../builders/test-fixture-builder";
import { TestBuilder } from "../../builders/test-builder";
import { TestCaseBuilder } from "../../builders/test-case-builder";
import { MatchError } from "../../../core/errors/match-error";
import { Expect, AsyncTest, TestCase, SpyOn, Setup, Teardown, FocusTest, IgnoreTest } from "../../../core/alsatian-core";
import { createPromise } from "../../../promise/create-promise";

export class FailingTestsTests {

  private _originalStdOut: any;
  private _originalStdErr: any;
  private _originalProcessExit: any;

   @Setup
   private _spyProcess() {
     this._originalProcessExit = process.exit;
     this._originalStdOut = process.stdout.write;
     this._originalStdErr = process.stderr.write;

     SpyOn(process, "exit").andStub();
     SpyOn(process.stdout, "write").andStub();
     SpyOn(process.stderr, "write").andStub();
   }

   @Teardown
   private _resetProcess() {
     process.exit = this._originalProcessExit;
     process.stdout.write = this._originalStdOut;
     process.stderr.write = this._originalStdErr;
   }

   @AsyncTest()
   public failingTestOutputsNotOk() {
      let testSet = <TestSet>{};

      (<any>testSet).testFixtures = [];
      let testFixtureBuilder = new TestFixtureBuilder();
      testFixtureBuilder.withFixture({ failingTest: () => { throw new MatchError("nothing", "something", "expected nothing to be something."); }});
      let testBuilder = new TestBuilder();
      testBuilder.withKey("failingTest");
      testBuilder.addTestCase(new TestCaseBuilder().build());
      testFixtureBuilder.addTest(testBuilder.build());
      testSet.testFixtures.push(testFixtureBuilder.build());

      let resultPromise = createPromise();

      let testRunner = new TestRunner();

      testRunner.run(testSet).then/*.call(testRunner, */(() => {
         Expect(process.stdout.write).toHaveBeenCalledWith("not ok 1 Test Function [  ]\n");
         resultPromise.resolve();
      });

      return resultPromise;
   }

   @AsyncTest()
   public testThrowsErrorOutputsNotOk() {
      let testSet = <TestSet>{};

      (<any>testSet).testFixtures = [];
      let testFixtureBuilder = new TestFixtureBuilder();
      testFixtureBuilder.withFixture({ failingTest: () => { throw new Error("something went wrong."); }});
      let testBuilder = new TestBuilder();
      testBuilder.withKey("failingTest");
      testBuilder.addTestCase(new TestCaseBuilder().build());
      testFixtureBuilder.addTest(testBuilder.build());
      testSet.testFixtures.push(testFixtureBuilder.build());

      let resultPromise: any = createPromise();

      let testRunner = new TestRunner();

      testRunner.run(testSet).then/*.call(testRunner, */(() => {
         Expect(process.stdout.write).toHaveBeenCalledWith("not ok 1 Test Function [  ]\n");
         resultPromise.resolve();
      });

      return resultPromise;
   }
}
