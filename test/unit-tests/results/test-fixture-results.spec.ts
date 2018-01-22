import { Expect, Test, TestCase } from "../../../core/alsatian-core";
import {
  EqualMatchError,
  ExactMatchError,
  MatchError
} from "../../../core/errors";
import { TestFixtureResults } from "../../../core/results/test-fixture-results";
import { TestOutcome } from "../../../core/results/test-outcome";
import { TestBuilder } from "../../builders/test-builder";
import { TestFixtureBuilder } from "../../builders/test-fixture-builder";

export class TestFixtureResultsTests {
  @Test()
  public onePassingTestOutcomePass() {
    const testFixture = new TestFixtureBuilder().build();
    const test = new TestBuilder().build();

    const testFixtureResults = new TestFixtureResults(testFixture);

    testFixtureResults.addTestResult(test).addTestCaseResult([]);

    Expect(testFixtureResults.outcome).toBe(TestOutcome.Pass);
  }

  @Test()
  public oneIgnoredTestOutcomeSkip() {
    const testFixture = new TestFixtureBuilder().build();
    const test = new TestBuilder().build();
    test.ignored = true;

    const testFixtureResults = new TestFixtureResults(testFixture);

    testFixtureResults.addTestResult(test).addTestCaseResult([]);

    Expect(testFixtureResults.outcome).toBe(TestOutcome.Skip);
  }

  @TestCase(TypeError)
  @TestCase(RangeError)
  @TestCase(EvalError)
  public oneTestErrorOutcomeError(errorType: new () => Error) {
    const testFixture = new TestFixtureBuilder().build();
    const test = new TestBuilder().build();

    const testFixtureResults = new TestFixtureResults(testFixture);

    testFixtureResults
      .addTestResult(test)
      .addTestCaseResult([], new errorType());

    Expect(testFixtureResults.outcome).toBe(TestOutcome.Error);
  }

  @TestCase(MatchError)
  @TestCase(ExactMatchError)
  @TestCase(EqualMatchError)
  public oneTestMatchErrorOutcomeFail(errorType: new () => Error) {
    const testFixture = new TestFixtureBuilder().build();
    const test = new TestBuilder().build();

    const testFixtureResults = new TestFixtureResults(testFixture);

    testFixtureResults
      .addTestResult(test)
      .addTestCaseResult([], new errorType());

    Expect(testFixtureResults.outcome).toBe(TestOutcome.Fail);
  }

  @TestCase(MatchError)
  @TestCase(ExactMatchError)
  @TestCase(EqualMatchError)
  public twoTestsOnePassOneMatchErrorOutcomeFail(errorType: new () => Error) {
    const testFixture = new TestFixtureBuilder().build();
    const test = new TestBuilder().build();

    const testFixtureResults = new TestFixtureResults(testFixture);

    testFixtureResults.addTestResult(test).addTestCaseResult([]);

    testFixtureResults
      .addTestResult(test)
      .addTestCaseResult([], new errorType());

    Expect(testFixtureResults.outcome).toBe(TestOutcome.Fail);
  }

  @TestCase(EvalError)
  @TestCase(RangeError)
  @TestCase(TypeError)
  public twoTestsOnePassOneErrorOutcomeError(errorType: new () => Error) {
    const testFixture = new TestFixtureBuilder().build();
    const test = new TestBuilder().build();

    const testFixtureResults = new TestFixtureResults(testFixture);

    testFixtureResults.addTestResult(test).addTestCaseResult([]);

    testFixtureResults
      .addTestResult(test)
      .addTestCaseResult([], new errorType());

    Expect(testFixtureResults.outcome).toBe(TestOutcome.Error);
  }

  @TestCase(EvalError, MatchError)
  @TestCase(ExactMatchError, RangeError)
  @TestCase(TypeError, EqualMatchError)
  public twoTestsOneMatchErrorOneErrorOutcomeError(
    errorTypeA: new () => Error,
    errorTypeB: new () => Error
  ) {
    const testFixture = new TestFixtureBuilder().build();
    const test = new TestBuilder().build();

    const testFixtureResults = new TestFixtureResults(testFixture);

    testFixtureResults
      .addTestResult(test)
      .addTestCaseResult([], new errorTypeA());

    testFixtureResults
      .addTestResult(test)
      .addTestCaseResult([], new errorTypeB());

    Expect(testFixtureResults.outcome).toBe(TestOutcome.Error);
  }

  @Test()
  public twoTestsNoErrorOutcomePass() {
    const testFixture = new TestFixtureBuilder().build();
    const test = new TestBuilder().build();

    const testFixtureResults = new TestFixtureResults(testFixture);

    testFixtureResults.addTestResult(test).addTestCaseResult([]);

    testFixtureResults.addTestResult(test).addTestCaseResult([]);

    Expect(testFixtureResults.outcome).toBe(TestOutcome.Pass);
  }

  @TestCase("fixture")
  @TestCase("awesome fixture")
  @TestCase("super sweet fixture")
  public testFixtureInConstructorIsAccessible(description: string) {
    const testFixture = new TestFixtureBuilder()
      .withDescription(description)
      .build();

    const testFixtureResults = new TestFixtureResults(testFixture);

    Expect(testFixtureResults.fixture).toBe(testFixture);
  }

  @TestCase(1)
  @TestCase(2)
  @TestCase(42)
  public correctNumberOfTestsAdded(testCount: number) {
    const testFixture = new TestFixtureBuilder().build();

    const testFixtureResults = new TestFixtureResults(testFixture);

    for (let i = 0; i < testCount; i++) {
      testFixtureResults.addTestResult(new TestBuilder().build());
    }

    Expect(testFixtureResults.testResults.length).toBe(testCount);
  }
}
