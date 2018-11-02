import {
  Test,
  Expect,
  Setup,
  SpyOn,
  Teardown,
  TestFixture
} from "../../../../core/alsatian-core";
import { MatchError } from "../../../../core/errors/match-error";
import { TestRunner } from "../../../../core/running/test-runner";
import { TestOutputStream } from "../../../../core/test-output-stream";
import { TestBuilder } from "../../../builders/test-builder";
import { TestCaseBuilder } from "../../../builders/test-case-builder";
import { TestFixtureBuilder } from "../../../builders/test-fixture-builder";
import { TestSetBuilder } from "../../../builders/test-set-builder";

@TestFixture("failing tests")
export class FailingTestsTests {
  private _originalStdErr: any;
  private _originalProcessExit: any;
  private _originalTestPlan: any;

  @Setup
  private _spyProcess() {
    this._originalProcessExit = process.exit;
    this._originalStdErr = process.stderr.write;
    this._originalTestPlan = Reflect.getMetadata("alsatian:test-plan", Expect);

    SpyOn(process, "exit").andStub();
    SpyOn(process.stderr, "write").andStub();
  }

  @Teardown
  private _resetProcess() {
    process.exit = this._originalProcessExit;
    process.stderr.write = this._originalStdErr;
    Reflect.defineMetadata(
      "alsatian:test-plan",
      this._originalTestPlan,
      Expect
    );
  }

  @Test("failing test outputs 'not ok'")
  public async failingTestOutputsNotOk() {
    const output = new TestOutputStream();
    SpyOn(output, "push");

    const testFixtureBuilder = new TestFixtureBuilder();
    testFixtureBuilder.withFixture({
      failingTest: () => {
        throw new MatchError(
          "nothing",
          "something",
          "expected nothing to be something."
        );
      }
    });

    const testBuilder = new TestBuilder();
    testBuilder.withKey("failingTest");
    testBuilder.addTestCase(new TestCaseBuilder().build());
    testFixtureBuilder.addTest(testBuilder.build());

    const fixture = testFixtureBuilder.build();
    const testSet = new TestSetBuilder().addTestFixture(fixture).build();

    const testRunner = new TestRunner(output);

    await testRunner.run(testSet);
    Expect(output.push).toHaveBeenCalledWith(
      "not ok 1 Unnamed Test Fixture > Test Function\n"
    );
  }

  @Test("a test that throws an error outputs 'not ok'")
  public async testThrowsErrorOutputsNotOk() {
    const output = new TestOutputStream();
    SpyOn(output, "push");

    const testFixtureBuilder = new TestFixtureBuilder();
    testFixtureBuilder.withFixture({
      failingTest: () => {
        throw new Error("something went wrong.");
      }
    });
    const testBuilder = new TestBuilder();
    testBuilder.withKey("failingTest");
    testBuilder.addTestCase(new TestCaseBuilder().build());
    testFixtureBuilder.addTest(testBuilder.build());

    const fixture = testFixtureBuilder.build();
    const testSet = new TestSetBuilder().addTestFixture(fixture).build();

    const testRunner = new TestRunner(output);

    await testRunner.run(testSet);
    Expect(output.push).toHaveBeenCalledWith(
      "not ok 1 Unnamed Test Fixture > Test Function\n"
    );
  }
}
