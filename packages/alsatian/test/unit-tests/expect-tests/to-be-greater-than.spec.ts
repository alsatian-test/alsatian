import { Expect, TestCase } from "../../../core/alsatian-core";
import { GreaterThanMatchError } from "../../../core/errors/greater-than-match-error";

export class ToBeGreaterThanTests {
  @TestCase(1, 0)
  @TestCase(42, 1)
  public greaterThanShouldNotThrowError(value: number, lowerLimit: number) {
    const expect = Expect(value);

    Expect(() => expect.toBeGreaterThan(lowerLimit)).not.toThrow();
  }

  @TestCase(1, 1)
  @TestCase(42, 42)
  public equalShouldThrowError(value: number, lowerLimit: number) {
    const expect = Expect(value);
    Expect(() => expect.toBeGreaterThan(lowerLimit)).toThrow();
  }

  @TestCase(0, 1)
  @TestCase(1, 42)
  public lessThanShouldThrowError(value: number, lowerLimit: number) {
    const expect = Expect(value);
    Expect(() => expect.toBeGreaterThan(lowerLimit)).toThrow();
  }

  @TestCase(1, 0)
  @TestCase(42, 1)
  public notGreaterThanShouldThrowError(value: number, lowerLimit: number) {
    const expect = Expect(value);

    Expect(() => expect.not.toBeGreaterThan(lowerLimit)).toThrow();
  }

  @TestCase(1, 1)
  @TestCase(42, 42)
  public notEqualShouldNotThrowError(value: number, lowerLimit: number) {
    const expect = Expect(value);
    Expect(() => expect.not.toBeGreaterThan(lowerLimit)).not.toThrow();
  }

  @TestCase(0, 1)
  @TestCase(1, 42)
  public notLessThanShouldNotThrowError(value: number, lowerLimit: number) {
    const expect = Expect(value);
    Expect(() => expect.not.toBeGreaterThan(lowerLimit)).not.toThrow();
  }

  @TestCase(0, 1)
  @TestCase(1, 42)
  public shouldBeGreaterThanMessage(value: number, lowerLimit: number) {
    const expect = Expect(value);

    Expect(() => expect.toBeGreaterThan(lowerLimit)).toThrowError(
      GreaterThanMatchError,
      "Expected " + value + " to be greater than " + lowerLimit + "."
    );
  }

  @TestCase(1, 0)
  @TestCase(42, 1)
  public shouldNotBeGreaterThanMessage(value: number, lowerLimit: number) {
    const expect = Expect(value);

    Expect(() => expect.not.toBeGreaterThan(lowerLimit)).toThrowError(
      GreaterThanMatchError,
      "Expected " + value + " not to be greater than " + lowerLimit + "."
    );
  }

  @TestCase(0)
  @TestCase(-1)
  @TestCase(42)
  public greaterThanShouldSetErrorActualValueToGivenValue(actualValue: number) {
    let greaterThanError: GreaterThanMatchError;

    try {
      Expect(actualValue).toBeGreaterThan(512);
    } catch (error) {
      greaterThanError = error;
    }

    Expect(greaterThanError).toBeDefined();
    Expect(greaterThanError).not.toBeNull();
    Expect(greaterThanError.actual).toBe(actualValue);
  }

  @TestCase(0)
  @TestCase(-1)
  @TestCase(42)
  public notGreaterThanShouldSetErrorActualValueToGivenValue(
    actualValue: number
  ) {
    let greaterThanError: GreaterThanMatchError;

    try {
      Expect(actualValue).not.toBeGreaterThan(-42);
    } catch (error) {
      greaterThanError = error;
    }

    Expect(greaterThanError).toBeDefined();
    Expect(greaterThanError).not.toBeNull();
    Expect(greaterThanError.actual).toBe(actualValue);
  }

  @TestCase(0)
  @TestCase(-1)
  @TestCase(42)
  public shouldSetExpectedValueToGreaterThanLowerLimit(lowerLimit: number) {
    let greaterThanError: GreaterThanMatchError;

    try {
      Expect(-42).toBeGreaterThan(lowerLimit);
    } catch (error) {
      greaterThanError = error;
    }

    Expect(greaterThanError).toBeDefined();
    Expect(greaterThanError).not.toBeNull();
    Expect(greaterThanError.expected).toBe(
      "a number greater than " + lowerLimit
    );
  }

  @TestCase(0)
  @TestCase(-1)
  @TestCase(42)
  public shouldSetExpectedValueToNotGreaterThanLowerLimit(lowerLimit: number) {
    let greaterThanError: GreaterThanMatchError;

    try {
      Expect(512).not.toBeGreaterThan(lowerLimit);
    } catch (error) {
      greaterThanError = error;
    }

    Expect(greaterThanError).toBeDefined();
    Expect(greaterThanError).not.toBeNull();
    Expect(greaterThanError.expected).toBe(
      "a number not greater than " + lowerLimit
    );
  }

  @TestCase(undefined)
  @TestCase(null)
  public checkingGreaterThanNullOrUndefinedShouldThrow(lowerLimit: number) {
    Expect(() => Expect(42).toBeGreaterThan(lowerLimit)).toThrowError(
      TypeError,
      "toBeGreaterThan lower limit must not be null or undefined."
    );
  }
}
