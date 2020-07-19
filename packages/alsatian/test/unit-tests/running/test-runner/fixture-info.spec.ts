import {
	AsyncTest,
	Expect,
	MatchError,
	SpyOn,
	TestCase,
	TestFixture,
	TestOutputStream,
	TestRunner,
	TestSet,
	Setup,
	Teardown
} from "../../../../core/alsatian-core";
import { TestBuilder } from "../../../builders/test-builder";
import { TestCaseBuilder } from "../../../builders/test-case-builder";
import { TestFixtureBuilder } from "../../../builders/test-fixture-builder";
import { TestPlan } from "../../../../core/running";

@TestFixture("fixture info tests")
export class FixtureInfoTests {
	private _originalTestPlan!: TestPlan;

	@Setup
	private _recordPreviousTestPlan() {
		this._originalTestPlan = Reflect.getMetadata(
			"alsatian:test-plan",
			Expect
		);
	}

	@Teardown
	private _resetPreviousTestPlan() {
		Reflect.defineMetadata(
			"alsatian:test-plan",
			this._originalTestPlan,
			Expect
		);
	}

	private static _getExpectedFixtureOutput(fixtureName: string): string {
		return `# FIXTURE ${fixtureName}\n`;
	}

	@AsyncTest("a passing test outputs the fixture name")
	@TestCase("SomeFixtureName")
	@TestCase("AnotherFixture")
	public async outputsFixtureNameWithPassingTest(fixtureDescription: string) {
		const output = new TestOutputStream();
		SpyOn(output, "push");

		const testSet = {
			testFixtures: []
		} as unknown as TestSet;

		const test = new TestBuilder()
			.withKey("test")
			.addTestCase(new TestCaseBuilder().build())
			.build();

		const testFixture = new TestFixtureBuilder()
			.withFixture({ test: () => {} })
			.withDescription(fixtureDescription)
			.addTest(test)
			.build();

		testSet.testFixtures.push(testFixture);

		const testRunner = new TestRunner(output);
		await testRunner.run(testSet);
		Expect(output.push).toHaveBeenCalledWith(
			FixtureInfoTests._getExpectedFixtureOutput(fixtureDescription)
		);
		Expect(output.push).toHaveBeenCalledWith(
			`ok 1 ${fixtureDescription} > ${test.description}\n`
		);
	}

	@AsyncTest("a failing tests outputs the fixture name")
	@TestCase("SomeFixtureName")
	@TestCase("AnotherFixture")
	public async outputsFixtureNameWithFailingTest(fixtureDescription: string) {
		const output = new TestOutputStream();
		SpyOn(output, "push");

		const testSet = {
			testFixtures: []
		} as unknown as TestSet;

		const test = new TestBuilder()
			.withKey("test")
			.addTestCase(new TestCaseBuilder().build())
			.build();

		const testFixture = new TestFixtureBuilder()
			.withFixture({
				test: () => {
					throw new MatchError(
						"nothing",
						"something",
						"expected nothing to be something."
					);
				}
			})
			.addTest(test)
			.withDescription(fixtureDescription)
			.build();

		testSet.testFixtures.push(testFixture);

		const testRunner = new TestRunner(output);
		await testRunner.run(testSet);

		testSet.testFixtures.push(testFixture);
		Expect(output.push).toHaveBeenCalledWith(
			FixtureInfoTests._getExpectedFixtureOutput(fixtureDescription)
		);
		Expect(output.push).toHaveBeenCalledWith(
			`not ok 1 ${fixtureDescription} > ${test.description}\n`
		);
	}
}
