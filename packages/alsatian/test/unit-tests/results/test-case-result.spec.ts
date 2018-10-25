import { Expect, Test, TestCase } from "../../../core/alsatian-core";
import { MatchError } from "../../../core/errors";
import { TestCaseResult } from "../../../core/results/test-case-result";
import { TestOutcome } from "../../../core/results/test-outcome";
import { TestBuilder } from "../../builders/test-builder";

export class TestCaseResultTests {
  @TestCase()
  @TestCase(1)
  @TestCase(1, 2)
  @TestCase("a", "list", "of", "arguments")
  @TestCase(1, "or", 2, "mixed", "arguments")
  public argumentsAreStored(...inputArguments: Array<any>) {
    const test = new TestBuilder().build();

    const testCaseResult = new TestCaseResult(test, inputArguments);

    Expect(testCaseResult.arguments).toEqual(inputArguments);
  }

  @Test()
  public noErrorAndNotIgnoredTestOutcomeIsPass() {
    const test = new TestBuilder().build();

    const testCaseResult = new TestCaseResult(test, []);

    Expect(testCaseResult.outcome).toEqual(TestOutcome.Pass);
  }

  @Test()
  public noErrorAndIgnoredTestOutcomeIsSkip() {
    const test = new TestBuilder().build();
    test.ignored = true;

    const testCaseResult = new TestCaseResult(test, []);

    Expect(testCaseResult.outcome).toEqual(TestOutcome.Skip);
  }

  @TestCase(TypeError)
  @TestCase(RangeError)
  @TestCase(EvalError)
  public errorOutcomeIsError(errorType: new () => Error) {
    const test = new TestBuilder().build();
    test.ignored = true;

    const testCaseResult = new TestCaseResult(test, [], new errorType());

    Expect(testCaseResult.outcome).toEqual(TestOutcome.Error);
  }

  @TestCase(MatchError)
  public matchErrorOutcomeIsFail(errorType: new () => Error) {
    const test = new TestBuilder().build();
    test.ignored = true;

    const testCaseResult = new TestCaseResult(test, [], new errorType());

    Expect(testCaseResult.outcome).toEqual(TestOutcome.Fail);
  }
}
