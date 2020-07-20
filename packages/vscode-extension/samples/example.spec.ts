import { Expect, Test, TestFixture, TestCase } from "alsatian";

@TestFixture("a sample test fixture")
export class SampleTestFixture {

	@Test("a passing test")
	public passing() {
		Expect(2).toBe(2);
	}

	@Test("a failing test")
	public failing() {
		Expect(2).toBe(3);
	}

	// to test errors thrown in the test runner rather than the test
	// @TestCase((null as any).something)
	@Test("an erroring test")
	public erroring() {
		throw new Error("Wow, this is always going to break!");
	}
}
