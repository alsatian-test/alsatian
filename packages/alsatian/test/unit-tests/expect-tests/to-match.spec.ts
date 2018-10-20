import { Expect, TestCase } from "../../../core/alsatian-core";
import { RegexMatchError } from "../../../core/errors/regex-match-error";

export class ToMatchTests {
  @TestCase("thing", /something/)
  @TestCase("another thing", /this and that/)
  public shouldMatchAndDoesNotThrow(
    actualValue: string,
    expectedRegex: RegExp
  ) {
    const expect = Expect(actualValue);

    Expect(() => expect.toMatch(expectedRegex)).toThrowError(
      RegexMatchError,
      `Expected ${JSON.stringify(actualValue)} to conform to ${expectedRegex}.`
    );
  }

  @TestCase("something", /thing/)
  @TestCase("another thing", /another thing/)
  public shouldMatchAndDoesDoesNotThrow(
    actualValue: string,
    expectedRegex: RegExp
  ) {
    const expect = Expect(actualValue);

    Expect(() => expect.toMatch(expectedRegex)).not.toThrow();
  }

  @TestCase("thing", /something/)
  @TestCase("another thing", /this and that/)
  public shouldNotMatchAndDoesNotDoesNotThrow(
    actualValue: string,
    expectedRegex: RegExp
  ) {
    const expect = Expect(actualValue);

    Expect(() => expect.not.toMatch(expectedRegex)).not.toThrow();
  }

  @TestCase("something", /thing/)
  @TestCase("another thing", /another thing/)
  public shouldNotMatchAndDoesThrow(
    actualValue: string,
    expectedRegex: RegExp
  ) {
    const expect = Expect(actualValue);

    Expect(() => expect.not.toMatch(expectedRegex)).toThrowError(
      RegexMatchError,
      `Expected ${JSON.stringify(
        actualValue
      )} not to conform to ${expectedRegex}.`
    );
  }

  @TestCase(undefined)
  @TestCase(null)
  public checkingStringMatchesNullOrUndefinedRegularExpressionShouldThrow(
    regex: RegExp
  ) {
    Expect(() => Expect("something").toMatch(regex)).toThrowError(
      TypeError,
      "toMatch regular expression must not be null or undefined."
    );
  }

  @TestCase(undefined)
  @TestCase(null)
  public checkingStringDoesNotMatchNullOrUndefinedRegularExpressionShouldThrow(
    regex: RegExp
  ) {
    Expect(() => Expect("something").not.toMatch(regex)).toThrowError(
      TypeError,
      "toMatch regular expression must not be null or undefined."
    );
  }
}
