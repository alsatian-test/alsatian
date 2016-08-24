import { TestRunner } from "../../../core/running/test-runner";
import { TestSet } from "../../../core/test-set";
import { TestOutput } from "../../../core/test-output";
import { TestFixtureBuilder } from "../../builders/test-fixture-builder";
import { TestBuilder } from "../../builders/test-builder";
import { TestCaseBuilder } from "../../builders/test-case-builder";
import { MatchError } from "../../../core/errors/match-error";
import { Expect, AsyncTest, TestCase, SpyOn, Setup, Teardown, FocusTest, IgnoreTest, FocusTests } from "../../../core/alsatian-core";
import { createPromise } from "../../../promise/create-promise";
import { OutputStreamBuilder } from "../../builders/output-stream-builder";

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
       let outputStream = new OutputStreamBuilder().build();
       SpyOn(outputStream, "write");

       let output = new TestOutput(outputStream);

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

      let testRunner = new TestRunner(output);

      testRunner.run(testSet).then(() => {
         Expect(outputStream.write).toHaveBeenCalledWith("not ok 1 Test Function\n");
         resultPromise.resolve();
      });

      return resultPromise;
   }

   @AsyncTest()
   public testThrowsErrorOutputsNotOk() {
       let outputStream = new OutputStreamBuilder().build();
       SpyOn(outputStream, "write");

       let output = new TestOutput(outputStream);

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

      let testRunner = new TestRunner(output);

      testRunner.run(testSet).then(() => {
         Expect(outputStream.write).toHaveBeenCalledWith("not ok 1 Test Function\n");
         resultPromise.resolve();
      });

      return resultPromise;
   }
}
