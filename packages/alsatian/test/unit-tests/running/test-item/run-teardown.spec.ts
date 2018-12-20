import {
	AsyncTest,
	Expect,
	FunctionSpy,
	METADATA_KEYS,
	TestCase
} from "../../../../core/alsatian-core";
import { TestItem } from "../../../../core/running/test-item";
import { TestBuilder } from "../../../builders/test-builder";
import { TestFixtureBuilder } from "../../../builders/test-fixture-builder";

export class TestItemRunTeardownTests {
	@TestCase(1)
	@TestCase(2)
	@TestCase(8)
	@AsyncTest()
	public async successfulSyncTeardown(teardownFunctionCount: number) {
		const test = new TestBuilder().withTestCaseCount(1).build();

		const testFixture = new TestFixtureBuilder()
			.withFixture({
				testFunction: () => {}
			})
			.addTest(test)
			.build();

		const teardownFunctions: Array<FunctionSpy> = [];
		const teardownFunctionInfo = [];

		for (let i = 0; i < teardownFunctionCount; i++) {
			const teardownFunction = new FunctionSpy();
			teardownFunctions.push(teardownFunction);
			const teardownFunctionKey = "teardownFunction" + i + 1;
			testFixture.fixture[teardownFunctionKey] = teardownFunction as any;
			teardownFunctionInfo.push({ propertyKey: teardownFunctionKey });
		}

		Reflect.defineMetadata(
			METADATA_KEYS.TEARDOWN,
			teardownFunctionInfo,
			testFixture.fixture
		);

		const testItem = new TestItem(testFixture, test, test.testCases[0]);

		await testItem.run(500);

		teardownFunctions.forEach(teardownFunction => {
			Expect(teardownFunction).toHaveBeenCalled();
		});
	}

	@TestCase(1)
	@TestCase(2)
	@TestCase(10)
	@AsyncTest()
	public async successfulAsyncTeardown(teardownFunctionCount: number) {
		const test = new TestBuilder().withTestCaseCount(1).build();

		const testFixture = new TestFixtureBuilder()
			.withFixture({
				testFunction: () => {}
			})
			.addTest(test)
			.build();

		const teardownFunctions = [];
		const teardownFunctionInfo = [];
		const teardownFunctionsCalled: Array<boolean> = [];

		for (let i = 0; i < teardownFunctionCount; i++) {
			const teardownFunction = () =>
				new Promise<void>((resolve, reject) => {
					setTimeout(() => {
						teardownFunctionsCalled[i] = true;
						resolve();
					}, 10);
				});

			teardownFunctions.push(teardownFunction);
			const teardownFunctionKey = "teardownFunction" + i + 1;
			testFixture.fixture[teardownFunctionKey] = teardownFunction;
			teardownFunctionInfo.push({
				propertyKey: teardownFunctionKey,
				isAsync: true
			});
			teardownFunctionsCalled.push(false);
		}

		Reflect.defineMetadata(
			METADATA_KEYS.TEARDOWN,
			teardownFunctionInfo,
			testFixture.fixture
		);

		const testItem = new TestItem(testFixture, test, test.testCases[0]);

		await testItem.run(500);

		teardownFunctionsCalled.forEach(teardownFunctionCalled => {
			Expect(teardownFunctionCalled).toBe(true);
		});
	}
}
