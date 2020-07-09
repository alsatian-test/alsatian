import { AsyncTest, Expect, Setup } from "../../../../core/alsatian-core";
import { TestRunner } from "../../../../core/running/test-runner";
import { TestOutputStream } from "../../../../core/test-output-stream";
import { TestBuilder } from "../../../builders/test-builder";
import { TestCaseBuilder } from "../../../builders/test-case-builder";
import { TestFixtureBuilder } from "../../../builders/test-fixture-builder";
import { TestSetBuilder } from "../../../builders/test-set-builder";
import { TestPlan } from "../../../../core/running";

export class FocussedTestTests {
	private originalTestPlan: TestPlan;

	@Setup
	private recordOriginalTestPlan() {
		this.originalTestPlan = Reflect.getMetadata(
			"alsatian:test-plan",
			Expect
		);
	}

	private restoreOriginalTestPlan() {
		Reflect.defineMetadata(
			"alsatian:test-plan",
			this.originalTestPlan,
			Expect
		);
	}

	@AsyncTest()
	public async twoUnfocussedTestsBothRun() {
		const output = new TestOutputStream();

		let testOneExecuted = false;
		let testTwoExecuted = false;

		const testFixtureBuilder = new TestFixtureBuilder().withFixture({
			testOne: () => {
				testOneExecuted = true;
			},
			testTwo: () => {
				testTwoExecuted = true;
			}
		});

		const testOne = new TestBuilder()
			.withKey("testOne")
			.addTestCase(new TestCaseBuilder().build())
			.build();

		const testTwo = new TestBuilder()
			.withKey("testTwo")
			.addTestCase(new TestCaseBuilder().build())
			.build();

		testFixtureBuilder.addTest(testOne);
		testFixtureBuilder.addTest(testTwo);

		const fixture = testFixtureBuilder.build();
		const testSet = new TestSetBuilder().addTestFixture(fixture).build();

		const testRunner = new TestRunner(output);

		await testRunner.run(testSet);

		this.restoreOriginalTestPlan();

		Expect(testOneExecuted).toBe(true);
		Expect(testTwoExecuted).toBe(true);
	}

	@AsyncTest()
	public async firstTestFocussedSecondUnfocussedFirstIsRun() {
		const output = new TestOutputStream();

		let testOneExecuted = false;
		let testTwoExecuted = false;

		const testFixtureBuilder = new TestFixtureBuilder().withFixture({
			testOne: () => {
				testOneExecuted = true;
			},
			testTwo: () => {
				testTwoExecuted = true;
			}
		});

		const testOne = new TestBuilder()
			.withKey("testOne")
			.addTestCase(new TestCaseBuilder().build())
			.focussed()
			.build();

		const testTwo = new TestBuilder()
			.withKey("testTwo")
			.addTestCase(new TestCaseBuilder().build())
			.build();

		testFixtureBuilder.addTest(testOne);
		testFixtureBuilder.addTest(testTwo);

		const fixture = testFixtureBuilder.build();
		const testSet = new TestSetBuilder().addTestFixture(fixture).build();

		const testRunner = new TestRunner(output);

		await testRunner.run(testSet);

		this.restoreOriginalTestPlan();

		Expect(testOneExecuted).toBe(true);
		Expect(testTwoExecuted).toBe(false);
	}

	@AsyncTest()
	public async secondTestFocussedFirstUnfocussedFirstIsRun() {
		const output = new TestOutputStream();

		let testOneExecuted = false;
		let testTwoExecuted = false;

		const testFixtureBuilder = new TestFixtureBuilder().withFixture({
			testOne: () => {
				testOneExecuted = true;
			},
			testTwo: () => {
				testTwoExecuted = true;
			}
		});

		const testOne = new TestBuilder()
			.withKey("testOne")
			.addTestCase(new TestCaseBuilder().build())
			.build();

		const testTwo = new TestBuilder()
			.withKey("testTwo")
			.addTestCase(new TestCaseBuilder().build())
			.focussed()
			.build();

		testFixtureBuilder.addTest(testOne);
		testFixtureBuilder.addTest(testTwo);

		const fixture = testFixtureBuilder.build();
		const testSet = new TestSetBuilder().addTestFixture(fixture).build();

		const testRunner = new TestRunner(output);

		await testRunner.run(testSet);

		this.restoreOriginalTestPlan();

		Expect(testOneExecuted).toBe(false);
		Expect(testTwoExecuted).toBe(true);
	}
}
