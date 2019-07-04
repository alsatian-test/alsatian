import { Expect, TestCase } from "../../../core/alsatian-core";
import { MatchError } from "../../../core/errors/match-error";

export class ToBeLessThanTests {
	@TestCase(1, 50)
	@TestCase(42, 200)
	public lessThanShouldNotThrowError(value: number, upperLimit: number) {
		const expect = Expect(value);
		Expect(() => expect.toBeLessThan(upperLimit)).not.toThrow();
	}

	@TestCase(1, 1)
	@TestCase(42, 42)
	public equalShouldThrowError(value: number, upperLimit: number) {
		const expect = Expect(value);
		Expect(() => expect.toBeLessThan(upperLimit)).toThrow();
	}

	@TestCase(22, 1)
	@TestCase(55, 5)
	public greaterThanShouldThrowError(value: number, upperLimit: number) {
		const expect = Expect(value);
		Expect(() => expect.toBeLessThan(upperLimit)).toThrow();
	}

	@TestCase(1, 50)
	@TestCase(42, 200)
	public lessThanShouldThrowWhenExpectedNotLessThan(
		value: number,
		upperLimit: number
	) {
		const expect = Expect(value);
		Expect(() => expect.not.toBeLessThan(upperLimit)).toThrow();
	}

	@TestCase(1, 1)
	@TestCase(42, 42)
	public equalShouldNotThrowWhenExpectedNotLessThan(
		value: number,
		upperLimit: number
	) {
		const expect = Expect(value);
		Expect(() => expect.not.toBeLessThan(upperLimit)).not.toThrow();
	}

	@TestCase(20, 1)
	@TestCase(125, 42)
	public greaterThanShouldNotThrowWhenExpectedNotLessThan(
		value: number,
		upperLimit: number
	) {
		const expect = Expect(value);
		Expect(() => expect.not.toBeLessThan(upperLimit)).not.toThrow();
	}

	@TestCase(7, 1)
	@TestCase(72, 42)
	public shouldThrowLessThanMatchErrorWithCorrectMessage(
		value: number,
		upperLimit: number
	) {
		const expect = Expect(value);
		Expect(() => expect.toBeLessThan(upperLimit)).toThrowError(
			MatchError,
			"Expected " + value + " to be less than " + upperLimit + "."
		);
	}

	@TestCase(1, 7)
	@TestCase(42, 72)
	public shouldThrowLessThanMatchErrorWithCorrectNotMessage(
		value: number,
		upperLimit: number
	) {
		const expect = Expect(value);
		Expect(() => expect.not.toBeLessThan(upperLimit)).toThrowError(
			MatchError,
			"Expected " + value + " not to be less than " + upperLimit + "."
		);
	}

	@TestCase(0)
	@TestCase(-1)
	@TestCase(42)
	public lessThanShouldSetErrorActualValueToGivenValue(actualValue: number) {
		let lessThanError: MatchError;

		try {
			Expect(actualValue).toBeLessThan(-42);
		} catch (error) {
			lessThanError = error;
		}

		Expect(lessThanError).toBeDefined();
		Expect(lessThanError).not.toBeNull();
		Expect(lessThanError.actual).toBe(actualValue);
	}

	@TestCase(0)
	@TestCase(-1)
	@TestCase(42)
	public notLessThanShouldSetErrorActualValueToGivenValue(
		actualValue: number
	) {
		let lessThanError: MatchError;

		try {
			Expect(actualValue).not.toBeLessThan(512);
		} catch (error) {
			lessThanError = error;
		}

		Expect(lessThanError).toBeDefined();
		Expect(lessThanError).not.toBeNull();
		Expect(lessThanError.actual).toBe(actualValue);
	}

	@TestCase(0)
	@TestCase(-1)
	@TestCase(42)
	public shouldSetExpectedValueToLessThanUpperLimit(upperLimit: number) {
		let lessThanError: MatchError;

		try {
			Expect(512).toBeLessThan(upperLimit);
		} catch (error) {
			lessThanError = error;
		}

		Expect(lessThanError).toBeDefined();
		Expect(lessThanError).not.toBeNull();
		Expect(lessThanError.expected).toBe("a number less than " + upperLimit);
	}

	@TestCase(0)
	@TestCase(-1)
	@TestCase(42)
	public shouldSetExpectedValueToNotLessThanUpperLimit(upperLimit: number) {
		let lessThanError: MatchError;

		try {
			Expect(-42).not.toBeLessThan(upperLimit);
		} catch (error) {
			lessThanError = error;
		}

		Expect(lessThanError).toBeDefined();
		Expect(lessThanError).not.toBeNull();
		Expect(lessThanError.expected).toBe(
			"a number not less than " + upperLimit
		);
	}

	@TestCase(undefined)
	@TestCase(null)
	public checkingLessThanNullOrUndefinedShouldThrow(upperLimit: number) {
		Expect(() => Expect(42).toBeLessThan(upperLimit)).toThrowError(
			TypeError,
			"toBeLessThan upper limit must not be null or undefined."
		);
	}
}
