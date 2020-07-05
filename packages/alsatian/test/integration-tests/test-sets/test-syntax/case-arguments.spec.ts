import { Expect, TestCase, TestFixture } from "alsatian";

@TestFixture("@TestCase Tests")
export class CaseArgumentTestsTests {
	@TestCase(1, 2, 3)
	@TestCase(1.5, 2.5, 4)
	public AddNumbers(first: number, second: number, expected: number) {
		Expect(first + second).toBe(expected);
	}

	@TestCase("Hello", " world!", "Hello world!")
	@TestCase("Far", "away", "Faraway")
	public AddStrings(first: number, second: number, expected: number) {
		Expect(first + second).toBe(expected);
	}

	@TestCase({ a: 1 }, { a: 2 }, 3)
	public AddObjectProperty(
		first: { a: number },
		second: { a: number },
		expected: number
	) {
		Expect(first.a + second.a).toBe(expected);
	}

	@TestCase([1, 2], [3, 4], 10)
	public AddArray(
		first: Array<number>,
		second: Array<number>,
		expected: number
	) {
		const reduced = [...first, ...second].reduce(
			(agg, curr) => agg + curr,
			0
		);
		Expect(reduced).toBe(expected);
	}
}
