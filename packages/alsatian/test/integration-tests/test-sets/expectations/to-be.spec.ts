import { Expect, Test, TestFixture } from "alsatian";

@TestFixture("To Be Tests")
export class ToBeTests {
	@Test()
	public twoPlusTwoMakeFour() {
		Expect(2 + 2).toBe(4);
	}

	@Test()
	public twoPlusTwoDoNotMakeFive() {
		Expect(2 + 2).not.toBe(5);
	}

	@Test()
	public twoPlusTwoDoNotMakeFour() {
		Expect(2 + 2).not.toBe(4);
	}

	@Test()
	public twoPlusTwoMakeFive() {
		Expect(2 + 2).toBe(5);
	}
}
