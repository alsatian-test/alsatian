import { TestSetResults } from "../../../core/results/test-set-results";
import { TestOutcome } from "../../../core/results/test-outcome";
import { Expect, Test, TestCase } from "../../../core/alsatian-core";
import { TestBuilder } from "../../builders/test-builder";
import { TestFixtureBuilder } from "../../builders/test-fixture-builder";
import { MatchError, ExactMatchError, EqualMatchError } from "../../../core/errors";

export class TestSetResultsTests {

  @Test()
  public onePassingTestFixtureOutcomePass() {

    const testFixture = new TestFixtureBuilder().build();
    const test = new TestBuilder().build();

    const testSetResults = new TestSetResults();

    testSetResults.addTestFixtureResult(testFixture)
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

      testSetResults.addTestFixtureResult(testFixture)
                 .addTestResult(test)
                 .addTestCaseResult([]);

      Expect(testSetResults.outcome).toBe(TestOutcome.Skip);
    }

    @TestCase(TypeError)
    @TestCase(RangeError)
    @TestCase(EvalError)
    public oneTestFixtureErrorOutcomeError(ErrorType: new () => Error) {

      const testFixture = new TestFixtureBuilder().build();
      const test = new TestBuilder().build();

      const testSetResults = new TestSetResults();

      testSetResults.addTestFixtureResult(testFixture)
                 .addTestResult(test)
                 .addTestCaseResult([], new ErrorType());

      Expect(testSetResults.outcome).toBe(TestOutcome.Error);
    }

    @TestCase(MatchError)
    @TestCase(ExactMatchError)
    @TestCase(EqualMatchError)
    public oneTestFixtureMatchErrorOutcomeFail(ErrorType: new () => Error) {

      const testFixture = new TestFixtureBuilder().build();
      const test = new TestBuilder().build();

      const testSetResults = new TestSetResults();

      testSetResults.addTestFixtureResult(testFixture)
                 .addTestResult(test)
                 .addTestCaseResult([], new ErrorType());

      Expect(testSetResults.outcome).toBe(TestOutcome.Fail);
    }

    @TestCase(MatchError)
    @TestCase(ExactMatchError)
    @TestCase(EqualMatchError)
    public twoTestFixturesOnePassOneMatchErrorOutcomeFail(ErrorType: new () => Error) {

      const testFixture = new TestFixtureBuilder().build();
      const test = new TestBuilder().build();

      const testSetResults = new TestSetResults();

      testSetResults.addTestFixtureResult(testFixture)
                 .addTestResult(test)
                 .addTestCaseResult([]);

      testSetResults.addTestFixtureResult(testFixture)
                 .addTestResult(test)
                 .addTestCaseResult([], new ErrorType());

      Expect(testSetResults.outcome).toBe(TestOutcome.Fail);
    }

    @TestCase(EvalError)
    @TestCase(RangeError)
    @TestCase(TypeError)
    public twoTestFixturesOnePassOneErrorOutcomeError(ErrorType: new () => Error) {

      const testFixture = new TestFixtureBuilder().build();
      const test = new TestBuilder().build();

      const testSetResults = new TestSetResults();

      testSetResults.addTestFixtureResult(testFixture)
                 .addTestResult(test)
                 .addTestCaseResult([]);

      testSetResults.addTestFixtureResult(testFixture)
                 .addTestResult(test)
                 .addTestCaseResult([], new ErrorType());

      Expect(testSetResults.outcome).toBe(TestOutcome.Error);
    }

    @TestCase(EvalError, MatchError)
    @TestCase(ExactMatchError, RangeError)
    @TestCase(TypeError, EqualMatchError)
    public twoTestFixturesOneMatchErrorOneErrorOutcomeError(ErrorTypeA: new () => Error, ErrorTypeB: new () => Error) {

      const testFixture = new TestFixtureBuilder().build();
      const test = new TestBuilder().build();

      const testSetResults = new TestSetResults();

      testSetResults.addTestFixtureResult(testFixture)
                 .addTestResult(test)
                 .addTestCaseResult([], new ErrorTypeA());

      testSetResults.addTestFixtureResult(testFixture)
                 .addTestResult(test)
                 .addTestCaseResult([], new ErrorTypeB());

      Expect(testSetResults.outcome).toBe(TestOutcome.Error);
    }

    @Test()
    public twoTestFixturesNoErrorOutcomePass() {

        const testFixture = new TestFixtureBuilder().build();
        const test = new TestBuilder().build();

        const testSetResults = new TestSetResults();

        testSetResults.addTestFixtureResult(testFixture)
                   .addTestResult(test)
                   .addTestCaseResult([]);

        testSetResults.addTestFixtureResult(testFixture)
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

          testSetResults.addTestFixtureResult(testFixture)
                   .addTestResult(test)
                   .addTestCaseResult([]);
        }

        Expect(testSetResults.testFixtureResults.length).toBe(testFixtureCount);
    }
}
