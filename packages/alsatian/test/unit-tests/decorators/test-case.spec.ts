import "reflect-metadata";
import {
	Expect,
	METADATA_KEYS,
	Test,
	TestCase
} from "../../../core/alsatian-core";
import { TestCase as TestCaseDecorator } from "../../../core/decorators/test-case-decorator";

export class TestCaseDecoratorTests {
	@Test()
	public testAddedAsMetaData() {
		const testCaseDecorator = TestCaseDecorator();

		const testFixture = {};

		testCaseDecorator(testFixture, "test", null);

		const tests = Reflect.getMetadata(METADATA_KEYS.TESTS, testFixture);

		Expect(tests).toBeDefined();
		Expect(tests).not.toBeNull();
	}

	@TestCase("key")
	@TestCase("another key")
	@TestCase("something-different")
	public testKeyMetaDataAdded(key: string) {
		const testCaseDecorator = TestCaseDecorator();

		const testFixture = {};

		testCaseDecorator(testFixture, key, null);

		const tests = Reflect.getMetadata(METADATA_KEYS.TESTS, testFixture);

		Expect(tests[0].key).toBe(key);
	}

	@TestCase(1)
	@TestCase(2)
	@TestCase(42)
	public correctTestCountAdded(testCount: number) {
		const testCaseDecorator = TestCaseDecorator();

		const testFixture = {};

		for (let i = 0; i < testCount; i++) {
			testCaseDecorator(testFixture, "key " + i, null);
		}

		const tests = Reflect.getMetadata(METADATA_KEYS.TESTS, testFixture);

		Expect(tests.length).toBe(testCount);
	}

	@TestCase(1)
	@TestCase(2)
	@TestCase(42)
	public noDuplicateTestKeysAdded(testCount: number) {
		const testCaseDecorator = TestCaseDecorator();

		const testFixture = {};

		for (let i = 0; i < testCount; i++) {
			testCaseDecorator(testFixture, "key", null);
		}

		const tests = Reflect.getMetadata(METADATA_KEYS.TESTS, testFixture);

		Expect(tests.length).toBe(1);
	}

	@Test()
	public testCasesAddedAsMetaData() {
		const testCaseDecorator = TestCaseDecorator();

		const testFixture = {};

		testCaseDecorator(testFixture, "test", null);

		const testCases = Reflect.getMetadata(
			METADATA_KEYS.TEST_CASES,
			testFixture,
			"test"
		);

		Expect(testCases).toBeDefined();
		Expect(testCases).not.toBeNull();
	}

	@TestCase([])
	@TestCase([1, 2, 3])
	@TestCase(["this", "that", "the other"])
	public testCaseArgumentsMetaDataAdded(expectedArguments: Array<any>) {
		const testCaseDecorator = TestCaseDecorator.apply(
			TestCaseDecorator,
			expectedArguments
		);

		const testFixture = {};

		testCaseDecorator(testFixture, "key", null);

		const testCases = Reflect.getMetadata(
			METADATA_KEYS.TEST_CASES,
			testFixture,
			"key"
		);

		Expect(testCases[0].caseArguments).toEqual(expectedArguments);
	}

	@TestCase("key")
	@TestCase("another key")
	@TestCase("something-different")
	public testCaseKeyMetaDataAddedWithCorrectKey(key: string) {
		const testCaseDecorator = TestCaseDecorator();

		const testFixture = {};

		testCaseDecorator(testFixture, key, null);

		const testCases = Reflect.getMetadata(
			METADATA_KEYS.TEST_CASES,
			testFixture,
			key
		);

		Expect(testCases).toBeDefined();
		Expect(testCases).not.toBeNull();
	}

	@TestCase(1)
	@TestCase(2)
	@TestCase(42)
	public testCaseArgumentsAlwaysAddedAsFirstIndex(testCount: number) {
		const dummyTestCaseDecorator = TestCaseDecorator();

		const testFixture = {};

		for (let i = 0; i < testCount; i++) {
			dummyTestCaseDecorator(testFixture, "key " + i, null);
		}

		const args = [1, 2, 3];
		TestCaseDecorator.apply(TestCaseDecorator, args)(
			testFixture,
			"key",
			null
		);

		const testCases = Reflect.getMetadata(
			METADATA_KEYS.TEST_CASES,
			testFixture,
			"key"
		);

		Expect(testCases[0].caseArguments).toEqual(args);
	}
}
