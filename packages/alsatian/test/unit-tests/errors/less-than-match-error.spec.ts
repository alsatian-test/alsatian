import { Expect, TestCase } from "../../../core/alsatian-core";
import { LessThanMatchError } from "../../../core/errors/less-than-match-error";

export class LessThanMatchErrorTests {
  @TestCase(1, 0)
  @TestCase(42, 1)
  public shouldBeLessThanMessage(actualValue: number, upperLimit: number) {
    const error = new LessThanMatchError(actualValue, upperLimit, true);

    Expect(error.message).toBe(
      "Expected " + actualValue + " to be less than " + upperLimit + "."
    );
  }

  @TestCase(0, 1)
  @TestCase(2, 2)
  @TestCase(1, 42)
  public shouldNotBeLessThanMessage(actualValue: number, upperLimit: number) {
    const error = new LessThanMatchError(actualValue, upperLimit, false);

    Expect(error.message).toBe(
      "Expected " + actualValue + " not to be less than " + upperLimit + "."
    );
  }

  @TestCase(0)
  @TestCase(-1)
  @TestCase(42)
  public shouldSetActualValueToGivenValue(actualValue: number) {
    Expect(new LessThanMatchError(actualValue, -42, true).actual).toBe(
      actualValue
    );
  }

  @TestCase(0)
  @TestCase(-1)
  @TestCase(42)
  public shouldSetExpectedValueToLessThanUpperLimit(upperLimit: number) {
    Expect(new LessThanMatchError(512, upperLimit, true).expected).toBe(
      "a number less than " + upperLimit
    );
  }

  @TestCase(0)
  @TestCase(-1)
  @TestCase(42)
  public shouldSetExpectedValueToNotLessThanUpperLimit(upperLimit: number) {
    Expect(new LessThanMatchError(512, upperLimit, false).expected).toBe(
      "a number not less than " + upperLimit
    );
  }
}
