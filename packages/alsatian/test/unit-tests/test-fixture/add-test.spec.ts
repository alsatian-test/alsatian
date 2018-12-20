import { TestFixture } from "../../../core/";
import { Expect, Test, TestCase } from "../../../core/alsatian-core";
import { TestBuilder } from "../../builders/test-builder";

export class AddTestsTests {
	@TestCase(1)
	@TestCase(2)
	@TestCase(3)
	public shouldAddCorrectAmountOfTests(testCount: number) {
		const testFixture = new TestFixture("Unnamed Test Fixture");

		for (let i = 0; i < testCount; i++) {
			testFixture.addTest(new TestBuilder().build());
		}

		Expect(testFixture.tests.length).toBe(testCount);
	}

	@TestCase(1)
	@TestCase(2)
	@TestCase(3)
	public shouldNotAddDuplicateTests(testCount: number) {
		const testFixture = new TestFixture("Unnamed Test Fixture");

		const test = new TestBuilder().build();

		for (let i = 0; i < testCount; i++) {
			testFixture.addTest(test);
		}

		Expect(testFixture.tests.length).toBe(1);
	}
}
