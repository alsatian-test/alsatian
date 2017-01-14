import { TestResults } from "../../../core/results/test-results";
import { TestOutcome } from "../../../core/results/test-outcome";
import { Expect, Test, TestCase } from "../../../core/alsatian-core";
import { TestBuilder } from "../../builders/test-builder";
import { MatchError, ExactMatchError, EqualMatchError } from "../../../core/errors";

export class TestResultsTests {

  @Test()
  public oneTestCaseNoErrorOutcomePass() {

    const test = new TestBuilder().build();

    const testResults = new TestResults(test);

    testResults.addTestCaseResult([]);

    Expect(testResults.outcome).toBe(TestOutcome.Pass);
  }

    @Test()
    public oneIgnoredTestCaseNoErrorOutcomeSkip() {

      const test = new TestBuilder().build();
      test.ignored = true;

      const testResults = new TestResults(test);

      testResults.addTestCaseResult([]);

      Expect(testResults.outcome).toBe(TestOutcome.Skip);
    }

    @TestCase(TypeError)
    @TestCase(RangeError)
    @TestCase(EvalError)
    public oneTestCaseErrorOutcomeError(ErrorType: new () => Error) {

      const test = new TestBuilder().build();

      const testResults = new TestResults(test);

      testResults.addTestCaseResult([], new ErrorType());

      Expect(testResults.outcome).toBe(TestOutcome.Error);
    }

    @TestCase(MatchError)
    @TestCase(ExactMatchError)
    @TestCase(EqualMatchError)
    public oneTestCaseMatchErrorOutcomeError(ErrorType: new () => Error) {

      const test = new TestBuilder().build();

      const testResults = new TestResults(test);

      testResults.addTestCaseResult([], new ErrorType());

      Expect(testResults.outcome).toBe(TestOutcome.Fail);
    }

    @TestCase(MatchError)
    @TestCase(ExactMatchError)
    @TestCase(EqualMatchError)
    public twoTestCasesOnePassOneMatchErrorOutcomeFail(ErrorType: new () => Error) {

      const test = new TestBuilder().build();

      const testResults = new TestResults(test);

      testResults.addTestCaseResult([]);
      testResults.addTestCaseResult([], new ErrorType());

      Expect(testResults.outcome).toBe(TestOutcome.Fail);
    }

    @TestCase(EvalError)
    @TestCase(RangeError)
    @TestCase(TypeError)
    public twoTestCasesOnePassOneErrorOutcomeError(ErrorType: new () => Error) {

      const test = new TestBuilder().build();

      const testResults = new TestResults(test);

      testResults.addTestCaseResult([]);
      testResults.addTestCaseResult([], new ErrorType());

      Expect(testResults.outcome).toBe(TestOutcome.Error);
    }

    @TestCase(EvalError, MatchError)
    @TestCase(ExactMatchError, RangeError)
    @TestCase(TypeError, EqualMatchError)
    public twoTestCasesOneMatchErrorOneErrorOutcomeError(ErrorTypeA: new () => Error, ErrorTypeB: new () => Error) {

      const test = new TestBuilder().build();

      const testResults = new TestResults(test);

      testResults.addTestCaseResult([], new ErrorTypeA());
      testResults.addTestCaseResult([], new ErrorTypeB());

      Expect(testResults.outcome).toBe(TestOutcome.Error);
    }

    @Test()
    public twoTestCasesNoErrorOutcomePass() {

      const test = new TestBuilder().build();

      const testResults = new TestResults(test);

      testResults.addTestCaseResult([]);
      testResults.addTestCaseResult([]);

      Expect(testResults.outcome).toBe(TestOutcome.Pass);
    }

    @TestCase("fixture")
    @TestCase("awesome fixture")
    @TestCase("super sweet fixture")
    public testInConstructorIsAccessible(description: string) {

        const test = new TestBuilder().withDescription(description).build();

        const testResults = new TestResults(test);

        Expect(testResults.test).toBe(test);
    }
}
