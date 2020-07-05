import { Expect, TestCase } from "../../../core/alsatian-core";
import { MatchError } from "../../../core/errors/match-error";

export class ToContainTests {
	@TestCase([], 1)
	@TestCase([1, 2], 42)
	public shouldContainArrayItemAndDoesNotThrows<T>(
		actualValue: Array<T>,
		expectedContent: T
	) {
		const expect = Expect(actualValue);

		Expect(() => expect.toContain(expectedContent)).toThrowError(
			MatchError,
			`Expected ${JSON.stringify(actualValue).replace(
				",",
				", "
			)} to contain ${JSON.stringify(expectedContent)}.`
		);
	}

	@TestCase("", "something")
	@TestCase("something", "another thing")
	public shouldContainStringAndDoesNotThrow(
		actualValue: string,
		expectedContent: string
	) {
		const expect = Expect(actualValue);

		Expect(() => expect.toContain(expectedContent)).toThrowError(
			MatchError,
			`Expected ${JSON.stringify(actualValue).replace(
				",",
				", "
			)} to contain ${JSON.stringify(expectedContent)}.`
		);
	}

	@TestCase([1], 1)
	@TestCase([1, 42], 42)
	public shouldContainArrayItemAndDoesDoesNotThrow<T>(
		actualValue: Array<T>,
		expectedContent: T
	) {
		const expect = Expect(actualValue);

		Expect(() => expect.toContain(expectedContent)).not.toThrow();
	}

	@TestCase("something", "something")
	@TestCase("something", "thing")
	public shouldContainStringAndDoesDoesNotThrow(
		actualValue: string,
		expectedContent: string
	) {
		const expect = Expect(actualValue);

		Expect(() => expect.toContain(expectedContent)).not.toThrow();
	}

	@TestCase([], 1)
	@TestCase([1, 2], 42)
	public shouldNotContainArrayItemAndDoesNotDoesNotThrow<T>(
		actualValue: Array<T>,
		expectedContent: T
	) {
		const expect = Expect(actualValue);

		Expect(() => expect.not.toContain(expectedContent)).not.toThrow();
	}

	@TestCase("", "something")
	@TestCase("something", "another thing")
	public shouldNotContainStringAndDoesNotDoesNotThrow(
		actualValue: string,
		expectedContent: string
	) {
		const expect = Expect(actualValue);

		Expect(() => expect.not.toContain(expectedContent)).not.toThrow();
	}

	@TestCase([1], 1)
	@TestCase([1, 42], 42)
	public shouldNotContainArrayItemAndDoesThrows<T>(
		actualValue: Array<T>,
		expectedContent: T
	) {
		const expect = Expect(actualValue);

		Expect(() => expect.not.toContain(expectedContent)).toThrowError(
			MatchError,
			`Expected ${JSON.stringify(actualValue).replace(",", ", ")} ` +
				`not to contain ${JSON.stringify(expectedContent)}.`
		);
	}

	@TestCase("something", "something")
	@TestCase("something", "thing")
	public shouldNotContainStringAndDoesThrow(
		actualValue: string,
		expectedContent: string
	) {
		const expect = Expect(actualValue);

		Expect(() => expect.not.toContain(expectedContent)).toThrowError(
			MatchError,
			`Expected ${JSON.stringify(actualValue).replace(",", ", ")} ` +
				`not to contain ${JSON.stringify(expectedContent)}.`
		);
	}

	@TestCase([], 1)
	@TestCase([1, 2], 42)
	public shouldBeTruthyArrayActualValueSet<T>(
		container: Array<T>,
		expectedContent: T
	) {
		let contentsError: MatchError | undefined;

		try {
			Expect(container).toContain(expectedContent);
		} catch (error) {
			contentsError = error;
		}

		Expect(contentsError).toBeDefined();
		Expect(contentsError).not.toBeNull();
		Expect(contentsError?.actual).toBe(container);
	}

	@TestCase("", "something")
	@TestCase("something", "another thing")
	public shouldBeTruthyStringActualValueSet(
		container: string,
		expectedContent: string
	) {
		let contentsError: MatchError | undefined;

		try {
			Expect(container).toContain(expectedContent);
		} catch (error) {
			contentsError = error;
		}

		Expect(contentsError).toBeDefined();
		Expect(contentsError).not.toBeNull();
		Expect(contentsError?.actual).toBe(container);
	}

	@TestCase([1], 1)
	@TestCase([1, 42], 42)
	public shouldNotBeTruthyArrayActualValueSet<T>(
		container: Array<T>,
		expectedContent: T
	) {
		let contentsError: MatchError | undefined;

		try {
			Expect(container).not.toContain(expectedContent);
		} catch (error) {
			contentsError = error;
		}

		Expect(contentsError).toBeDefined();
		Expect(contentsError).not.toBeNull();
		Expect(contentsError?.actual).toBe(container);
	}

	@TestCase("something", "something")
	@TestCase("something", "thing")
	public shouldNotBeTruthyStringActualValueSet(
		container: string,
		expectedContent: string
	) {
		let contentsError: MatchError | undefined;

		try {
			Expect(container).not.toContain(expectedContent);
		} catch (error) {
			contentsError = error;
		}

		Expect(contentsError).toBeDefined();
		Expect(contentsError).not.toBeNull();
		Expect(contentsError?.actual).toBe(container);
	}

	@TestCase([], 1)
	@TestCase([1, 2], 42)
	public shoulContainExpectedValueSetToArrayItemExpectedContent<T>(
		container: Array<T>,
		expectedContent: T
	) {
		let contentsError: MatchError | undefined;

		try {
			Expect(container).toContain(expectedContent);
		} catch (error) {
			contentsError = error;
		}

		Expect(contentsError).toBeDefined();
		Expect(contentsError).not.toBeNull();
		Expect(contentsError?.expected).toBe(expectedContent);
	}

	@TestCase("", "something")
	@TestCase("something", "another thing")
	public shoulContainExpectedValueSetToStringExpectedContent(
		container: string,
		expectedContent: string
	) {
		let contentsError: MatchError | undefined;

		try {
			Expect(container).toContain(expectedContent);
		} catch (error) {
			contentsError = error;
		}

		Expect(contentsError).toBeDefined();
		Expect(contentsError).not.toBeNull();
		Expect(contentsError?.expected).toBe(expectedContent);
	}

	@TestCase([1], 1)
	@TestCase([1, 42], 42)
	public shouldNotConrtainExpectedValueSetToArrayItemExpectedContent<T>(
		container: Array<T>,
		expectedContent: T
	) {
		let contentsError: MatchError | undefined;

		try {
			Expect(container).not.toContain(expectedContent);
		} catch (error) {
			contentsError = error;
		}

		Expect(contentsError).toBeDefined();
		Expect(contentsError).not.toBeNull();
		Expect(contentsError?.expected).toBe(expectedContent);
	}

	@TestCase("something", "something")
	@TestCase("something", "thing")
	public shouldNotContainExpectedValueSetToStringExpectedContent(
		container: string,
		expectedContent: string
	) {
		let contentsError: MatchError | undefined;

		try {
			Expect(container).not.toContain(expectedContent);
		} catch (error) {
			contentsError = error;
		}

		Expect(contentsError).toBeDefined();
		Expect(contentsError).not.toBeNull();
		Expect(contentsError?.expected).toBe(expectedContent);
	}
}
