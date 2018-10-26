import { Expect, Test, TestCase } from "../../../core/alsatian-core";
import { MatchError } from "../../../core/errors";
import { TestOutcome } from "../../../core/results/test-outcome";
import { TestResults } from "../../../core/results/test-results";
import { TestBuilder } from "../../builders/test-builder";
import { TestFixtureResultsBuilder } from "../../builders/test-fixture-results-builder";

export class TestResultsTests {
  @Test()
  public oneTestCaseNoErrorOutcomePass() {
    const test = new TestBuilder().build();
    const testFixtureResults = new TestFixtureResultsBuilder().build();

    const testResults = new TestResults(testFixtureResults, test);

    testResults.addTestCaseResult([]);

    Expect(testResults.outcome).toBe(TestOutcome.Pass);
  }

  @Test()
  public oneIgnoredTestCaseNoErrorOutcomeSkip() {
    const test = new TestBuilder().build();
    test.ignored = true;
    const testFixtureResults = new TestFixtureResultsBuilder().build();

    const testResults = new TestResults(testFixtureResults, test);

    testResults.addTestCaseResult([]);

    Expect(testResults.outcome).toBe(TestOutcome.Skip);
  }

  @TestCase(TypeError)
  @TestCase(RangeError)
  @TestCase(EvalError)
  public oneTestCaseErrorOutcomeError(errorType: new () => Error) {
    const test = new TestBuilder().build();
    const testFixtureResults = new TestFixtureResultsBuilder().build();

    const testResults = new TestResults(testFixtureResults, test);

    testResults.addTestCaseResult([], new errorType());

    Expect(testResults.outcome).toBe(TestOutcome.Error);
  }

  @TestCase(MatchError)
  public oneTestCaseMatchErrorOutcomeError(errorType: new () => Error) {
    const test = new TestBuilder().build();
    const testFixtureResults = new TestFixtureResultsBuilder().build();

    const testResults = new TestResults(testFixtureResults, test);

    testResults.addTestCaseResult([], new errorType());

    Expect(testResults.outcome).toBe(TestOutcome.Fail);
  }

  @TestCase(MatchError)
  public twoTestCasesOnePassOneMatchErrorOutcomeFail(
    errorType: new () => Error
  ) {
    const test = new TestBuilder().build();
    const testFixtureResults = new TestFixtureResultsBuilder().build();

    const testResults = new TestResults(testFixtureResults, test);

    testResults.addTestCaseResult([]);
    testResults.addTestCaseResult([], new errorType());

    Expect(testResults.outcome).toBe(TestOutcome.Fail);
  }

  @TestCase(EvalError)
  @TestCase(RangeError)
  @TestCase(TypeError)
  public twoTestCasesOnePassOneErrorOutcomeError(errorType: new () => Error) {
    const test = new TestBuilder().build();
    const testFixtureResults = new TestFixtureResultsBuilder().build();

    const testResults = new TestResults(testFixtureResults, test);

    testResults.addTestCaseResult([]);
    testResults.addTestCaseResult([], new errorType());

    Expect(testResults.outcome).toBe(TestOutcome.Error);
  }

  @TestCase(EvalError, MatchError)
  public twoTestCasesOneMatchErrorOneErrorOutcomeError(
    errorTypeA: new () => Error,
    errorTypeB: new () => Error
  ) {
    const test = new TestBuilder().build();
    const testFixtureResults = new TestFixtureResultsBuilder().build();

    const testResults = new TestResults(testFixtureResults, test);

    testResults.addTestCaseResult([], new errorTypeA());
    testResults.addTestCaseResult([], new errorTypeB());

    Expect(testResults.outcome).toBe(TestOutcome.Error);
  }

  @Test()
  public twoTestCasesNoErrorOutcomePass() {
    const test = new TestBuilder().build();
    const testFixtureResults = new TestFixtureResultsBuilder().build();

    const testResults = new TestResults(testFixtureResults, test);

    testResults.addTestCaseResult([]);
    testResults.addTestCaseResult([]);

    Expect(testResults.outcome).toBe(TestOutcome.Pass);
  }

  @TestCase("fixture")
  @TestCase("awesome fixture")
  @TestCase("super sweet fixture")
  public testInConstructorIsAccessible(description: string) {
    const test = new TestBuilder().withDescription(description).build();
    const testFixtureResults = new TestFixtureResultsBuilder().build();

    const testResults = new TestResults(testFixtureResults, test);

    Expect(testResults.test).toBe(test);
  }
}
