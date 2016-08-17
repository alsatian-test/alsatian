import { TestCaseResult } from "../../../core/results/test-case-result";
import { TestOutcome } from "../../../core/results/test-outcome";
import { Expect, Test, TestCase } from "../../../core/alsatian-core";
import { TestBuilder } from "../../builders/test-builder";
import { MatchError, ExactMatchError, EqualMatchError } from "../../../core/_errors";

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
  public errorOutcomeIsError(ErrorType: new () => Error) {

    const test = new TestBuilder().build();
    test.ignored = true;

    const testCaseResult = new TestCaseResult(test, [], new ErrorType());

    Expect(testCaseResult.outcome).toEqual(TestOutcome.Error);
  }

  @TestCase(MatchError)
  @TestCase(ExactMatchError)
  @TestCase(EqualMatchError)
  public matchErrorOutcomeIsFail(ErrorType: new () => Error) {

    const test = new TestBuilder().build();
    test.ignored = true;

    const testCaseResult = new TestCaseResult(test, [], new ErrorType());

    Expect(testCaseResult.outcome).toEqual(TestOutcome.Fail);
  }
}
