import { Expect, Test, TestFixture } from "alsatian";

@TestFixture("a sample test fixture")
export class SampleTestFixture {
	@Test("a failing test")
	failing() {
		Expect({ an: "object" }).toEqual({ an: "object" });
	}
	@Test("a passing test")
	passing() {
		Expect(2).toBe(2);
	}
}
