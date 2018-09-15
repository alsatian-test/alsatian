import { Expect, Test, TestCase } from "../../../core/alsatian-core";
import { MatchError } from "../../../core/errors";
import { TestOutcome } from "../../../core/results/test-outcome";
import { TestSetResults } from "../../../core/results/test-set-results";
import { TestBuilder } from "../../builders/test-builder";
import { TestFixtureBuilder } from "../../builders/test-fixture-builder";

export class TestSetResultsTests {
  @Test()
  public onePassingTestFixtureOutcomePass() {
    const testFixture = new TestFixtureBuilder().build();
    const test = new TestBuilder().build();

    const testSetResults = new TestSetResults();

    testSetResults
      .addTestFixtureResult(testFixture)
      .addTestResult(test)
      .addTestCaseResult([]);

    Expect(testSetResults.outcome).toBe(TestOutcome.Pass);
  }

  @Test()
  public oneIgnoredTestFixtureOutcomeSkip() {
    const testFixture = new TestFixtureBuilder().build();
    const test = new TestBuilder().build();
    test.ignored = true;

    const testSetResults = new TestSetResults();

    testSetResults
      .addTestFixtureResult(testFixture)
      .addTestResult(test)
      .addTestCaseResult([]);

    Expect(testSetResults.outcome).toBe(TestOutcome.Skip);
  }

  @TestCase(TypeError)
  @TestCase(RangeError)
  @TestCase(EvalError)
  public oneTestFixtureErrorOutcomeError(errorType: new () => Error) {
    const testFixture = new TestFixtureBuilder().build();
    const test = new TestBuilder().build();

    const testSetResults = new TestSetResults();

    testSetResults
      .addTestFixtureResult(testFixture)
      .addTestResult(test)
      .addTestCaseResult([], new errorType());

    Expect(testSetResults.outcome).toBe(TestOutcome.Error);
  }

  @TestCase(MatchError)
  public oneTestFixtureMatchErrorOutcomeFail(errorType: new () => Error) {
    const testFixture = new TestFixtureBuilder().build();
    const test = new TestBuilder().build();

    const testSetResults = new TestSetResults();

    testSetResults
      .addTestFixtureResult(testFixture)
      .addTestResult(test)
      .addTestCaseResult([], new errorType());

    Expect(testSetResults.outcome).toBe(TestOutcome.Fail);
  }

  @TestCase(MatchError)
  public twoTestFixturesOnePassOneMatchErrorOutcomeFail(
    errorType: new () => Error
  ) {
    const testFixture = new TestFixtureBuilder().build();
    const test = new TestBuilder().build();

    const testSetResults = new TestSetResults();

    testSetResults
      .addTestFixtureResult(testFixture)
      .addTestResult(test)
      .addTestCaseResult([]);

    testSetResults
      .addTestFixtureResult(testFixture)
      .addTestResult(test)
      .addTestCaseResult([], new errorType());

    Expect(testSetResults.outcome).toBe(TestOutcome.Fail);
  }

  @TestCase(EvalError)
  @TestCase(RangeError)
  @TestCase(TypeError)
  public twoTestFixturesOnePassOneErrorOutcomeError(
    errorType: new () => Error
  ) {
    const testFixture = new TestFixtureBuilder().build();
    const test = new TestBuilder().build();

    const testSetResults = new TestSetResults();

    testSetResults
      .addTestFixtureResult(testFixture)
      .addTestResult(test)
      .addTestCaseResult([]);

    testSetResults
      .addTestFixtureResult(testFixture)
      .addTestResult(test)
      .addTestCaseResult([], new errorType());

    Expect(testSetResults.outcome).toBe(TestOutcome.Error);
  }

  @TestCase(EvalError, MatchError)
  public twoTestFixturesOneMatchErrorOneErrorOutcomeError(
    errorTypeA: new () => Error,
    errorTypeB: new () => Error
  ) {
    const testFixture = new TestFixtureBuilder().build();
    const test = new TestBuilder().build();

    const testSetResults = new TestSetResults();

    testSetResults
      .addTestFixtureResult(testFixture)
      .addTestResult(test)
      .addTestCaseResult([], new errorTypeA());

    testSetResults
      .addTestFixtureResult(testFixture)
      .addTestResult(test)
      .addTestCaseResult([], new errorTypeB());

    Expect(testSetResults.outcome).toBe(TestOutcome.Error);
  }

  @Test()
  public twoTestFixturesNoErrorOutcomePass() {
    const testFixture = new TestFixtureBuilder().build();
    const test = new TestBuilder().build();

    const testSetResults = new TestSetResults();

    testSetResults
      .addTestFixtureResult(testFixture)
      .addTestResult(test)
      .addTestCaseResult([]);

    testSetResults
      .addTestFixtureResult(testFixture)
      .addTestResult(test)
      .addTestCaseResult([]);

    Expect(testSetResults.outcome).toBe(TestOutcome.Pass);
  }

  @TestCase(1)
  @TestCase(2)
  @TestCase(42)
  public correctNumberOfTestFixtureResultsAdded(testFixtureCount: number) {
    const testSetResults = new TestSetResults();

    for (let i = 0; i < testFixtureCount; i++) {
      const testFixture = new TestFixtureBuilder().build();
      const test = new TestBuilder().build();

      testSetResults
        .addTestFixtureResult(testFixture)
        .addTestResult(test)
        .addTestCaseResult([]);
    }

    Expect(testSetResults.testFixtureResults.length).toBe(testFixtureCount);
  }
}
