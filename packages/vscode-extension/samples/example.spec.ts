import { Expect, Test, TestFixture } from "alsatian";

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
}
