import {
	Test,
	Expect,
	Setup,
	SpyOn,
	Teardown,
	TestCase
} from "../../../../core/alsatian-core";
import { TestRunner } from "../../../../core/running/test-runner";
import { TestBuilder } from "../../../builders/test-builder";
import { TestFixtureBuilder } from "../../../builders/test-fixture-builder";
import { TestSetBuilder } from "../../../builders/test-set-builder";
import { TestPlan } from "../../../../core/running";

export class NotestsErrorTests {
	private originalStdErr: any;
	private originalProcessExit: any;
	private originalTestPlan!: TestPlan;

	@Setup
	private spyProcess() {
		this.originalProcessExit = process.exit;
		this.originalStdErr = process.stderr.write;
		this.originalTestPlan = Reflect.getMetadata(
			"alsatian:test-plan",
			Expect
		);

		SpyOn(process, "exit").andStub();
		SpyOn(process.stderr, "write").andStub();
	}

	@Teardown
	private resetProcess() {
		process.exit = this.originalProcessExit;
		process.stderr.write = this.originalStdErr;
		Reflect.defineMetadata(
			"alsatian:test-plan",
			this.originalTestPlan,
			Expect
		);
	}

	@Test("empty test fixture throws no tests error")
	public async emptyTestFixturesThrowsError() {
		const testSet = new TestSetBuilder().build();

		const testRunner = new TestRunner();

		let error: Error | undefined;

		try {
			await testRunner.run(testSet);
		} catch (e) {
			error = e;
		}

		Expect(error).toBeDefined();
		Expect(error).not.toBeNull();
		Expect(error?.constructor).toBe(Error);
		Expect(error?.message).toBe("no tests to run.");
	}

	@TestCase(1)
	@TestCase(2)
	@TestCase(13)
	@Test(
		"one test fixture with multiple empty tests throws no tests error"
	)
	public async testFixtureWithEmptyTestsOutputsNoTestError(
		testCount: number
	) {
		const testFixtureBuilder = new TestFixtureBuilder();

		for (let i = 0; i < testCount; i++) {
			testFixtureBuilder.addTest(new TestBuilder().build());
		}

		const fixture = testFixtureBuilder.build();
		const testSet = new TestSetBuilder().addTestFixture(fixture).build();

		const testRunner = new TestRunner();

		let error: Error | undefined;

		try {
			await testRunner.run(testSet);
		} catch (e) {
			error = e;
		}

		Expect(error).toBeDefined();
		Expect(error).not.toBeNull();
		Expect(error?.constructor).toBe(Error);
		Expect(error?.message).toBe("no tests to run.");
	}

	@TestCase(1)
	@TestCase(2)
	@TestCase(13)
	@Test("multiple test fixtures with no tests throws no tests error")
	public async multipleTestFixtureWithEmptyTestOutputsNoTestError(
		testFixtureCount: number
	) {
		const fixtures = [];

		for (let i = 0; i < testFixtureCount; i++) {
			fixtures.push(new TestFixtureBuilder().build());
		}

		const testSet = new TestSetBuilder().withTestFixtures(fixtures).build();

		const testRunner = new TestRunner();

		let error: Error | undefined;

		try {
			await testRunner.run(testSet);
		} catch (e) {
			error = e;
		}

		Expect(error).toBeDefined();
		Expect(error).not.toBeNull();
		Expect(error?.constructor).toBe(Error);
		Expect(error?.message).toBe("no tests to run.");
	}

	@TestCase(1, 1)
	@TestCase(1, 2)
	@TestCase(1, 13)
	@TestCase(2, 1)
	@TestCase(2, 2)
	@TestCase(2, 13)
	@TestCase(13, 1)
	@TestCase(13, 2)
	@TestCase(13, 13)
	@Test(
		"multiple test fixtures with multiple empty tests throws no tests error"
	)
	public async multipleTestFixtureWithMultipleEmptyTestOutputsNoTestError(
		testFixtureCount: number,
		testCount: number
	) {
		const fixtures = [];

		for (let i = 0; i < testFixtureCount; i++) {
			const testFixtureBuilder = new TestFixtureBuilder();

			for (let j = 0; j < testCount; j++) {
				testFixtureBuilder.addTest(new TestBuilder().build());
			}

			fixtures.push(testFixtureBuilder.build());
		}

		const testSet = new TestSetBuilder().withTestFixtures(fixtures).build();

		const testRunner = new TestRunner();

		let error: Error | undefined;

		try {
			await testRunner.run(testSet);
		} catch (e) {
			error = e;
		}

		Expect(error).toBeDefined();
		Expect(error).not.toBeNull();
		Expect(error?.constructor).toBe(Error);
		Expect(error?.message).toBe("no tests to run.");
	}
}
