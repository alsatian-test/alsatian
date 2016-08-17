import { TestFixtureResults } from "../../../core/results/test-fixture-results";
import { TestOutcome } from "../../../core/results/test-outcome";
import { Expect, Test, TestCase } from "../../../core/alsatian-core";
import { TestBuilder } from "../../builders/test-builder";
import { TestFixtureBuilder } from "../../builders/test-fixture-builder";
import { MatchError, ExactMatchError, EqualMatchError } from "../../../core/_errors";

export class TestFixtureResultsTests {

  @Test()
  public onePassingTestOutcomePass() {

    const testFixture = new TestFixtureBuilder().build();
    const test = new TestBuilder().build();

    const testFixtureResults = new TestFixtureResults(testFixture);

    testFixtureResults.addTestResult(test)
               .addTestCaseResult([]);

    Expect(testFixtureResults.outcome).toBe(TestOutcome.Pass);
  }

    @Test()
    public oneIgnoredTestOutcomeSkip() {

      const testFixture = new TestFixtureBuilder().build();
      const test = new TestBuilder().build();
      test.ignored = true;

      const testFixtureResults = new TestFixtureResults(testFixture);

      testFixtureResults.addTestResult(test)
                 .addTestCaseResult([]);

      Expect(testFixtureResults.outcome).toBe(TestOutcome.Skip);
    }

    @TestCase(TypeError)
    @TestCase(RangeError)
    @TestCase(EvalError)
    public oneTestErrorOutcomeError(ErrorType: new () => Error) {

      const testFixture = new TestFixtureBuilder().build();
      const test = new TestBuilder().build();

      const testFixtureResults = new TestFixtureResults(testFixture);

      testFixtureResults.addTestResult(test)
                 .addTestCaseResult([], new ErrorType());

      Expect(testFixtureResults.outcome).toBe(TestOutcome.Error);
    }

    @TestCase(MatchError)
    @TestCase(ExactMatchError)
    @TestCase(EqualMatchError)
    public oneTestMatchErrorOutcomeFail(ErrorType: new () => Error) {

      const testFixture = new TestFixtureBuilder().build();
      const test = new TestBuilder().build();

      const testFixtureResults = new TestFixtureResults(testFixture);

      testFixtureResults.addTestResult(test)
                 .addTestCaseResult([], new ErrorType());

      Expect(testFixtureResults.outcome).toBe(TestOutcome.Fail);
    }

    @TestCase(MatchError)
    @TestCase(ExactMatchError)
    @TestCase(EqualMatchError)
    public twoTestsOnePassOneMatchErrorOutcomeFail(ErrorType: new () => Error) {

      const testFixture = new TestFixtureBuilder().build();
      const test = new TestBuilder().build();

      const testFixtureResults = new TestFixtureResults(testFixture);

      testFixtureResults.addTestResult(test)
                 .addTestCaseResult([]);

      testFixtureResults.addTestResult(test)
                 .addTestCaseResult([], new ErrorType());

      Expect(testFixtureResults.outcome).toBe(TestOutcome.Fail);
    }

    @TestCase(EvalError)
    @TestCase(RangeError)
    @TestCase(TypeError)
    public twoTestsOnePassOneErrorOutcomeError(ErrorType: new () => Error) {

      const testFixture = new TestFixtureBuilder().build();
      const test = new TestBuilder().build();

      const testFixtureResults = new TestFixtureResults(testFixture);

      testFixtureResults.addTestResult(test)
                 .addTestCaseResult([]);

      testFixtureResults.addTestResult(test)
                 .addTestCaseResult([], new ErrorType());

      Expect(testFixtureResults.outcome).toBe(TestOutcome.Error);
    }

    @TestCase(EvalError, MatchError)
    @TestCase(ExactMatchError, RangeError)
    @TestCase(TypeError, EqualMatchError)
    public twoTestsOneMatchErrorOneErrorOutcomeError(ErrorTypeA: new () => Error, ErrorTypeB: new () => Error) {

      const testFixture = new TestFixtureBuilder().build();
      const test = new TestBuilder().build();

      const testFixtureResults = new TestFixtureResults(testFixture);

      testFixtureResults.addTestResult(test)
                 .addTestCaseResult([], new ErrorTypeA());

      testFixtureResults.addTestResult(test)
                 .addTestCaseResult([], new ErrorTypeB());

      Expect(testFixtureResults.outcome).toBe(TestOutcome.Error);
    }

    @Test()
    public twoTestsNoErrorOutcomePass() {

        const testFixture = new TestFixtureBuilder().build();
        const test = new TestBuilder().build();

        const testFixtureResults = new TestFixtureResults(testFixture);

        testFixtureResults.addTestResult(test)
                   .addTestCaseResult([]);

        testFixtureResults.addTestResult(test)
                   .addTestCaseResult([]);

        Expect(testFixtureResults.outcome).toBe(TestOutcome.Pass);
    }
}
