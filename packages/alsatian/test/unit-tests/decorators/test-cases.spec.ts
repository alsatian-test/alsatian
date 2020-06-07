import "reflect-metadata";
import {
	Expect,
	METADATA_KEYS,
	Test,
	TestCase,
	SpyOn
} from "../../../core/alsatian-core";
import { TestCases as TestCasesDecorator } from "../../../core/decorators/test-cases-decorator";
import { Warner } from "../../../core/maintenance/warn";

export class TestCaseDecoratorTests {
	@Test()
	public testAddedAsMetaData() {
		const testCaseDecorator = TestCasesDecorator([[1]]);

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
		const testCaseDecorator = TestCasesDecorator([[1]]);

		const testFixture = {};

		testCaseDecorator(testFixture, key, null);

		const tests = Reflect.getMetadata(METADATA_KEYS.TESTS, testFixture);

		Expect(tests[0].key).toBe(key);
	}

	@TestCase(1)
	@TestCase(2)
	@TestCase(42)
	public correctTestCountAdded(testCount: number) {
		const testCaseDecorator = TestCasesDecorator([[1]]);

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
		const testCaseDecorator = TestCasesDecorator([[1]]);

		const testFixture = {};

		for (let i = 0; i < testCount; i++) {
			testCaseDecorator(testFixture, "key", null);
		}

		const tests = Reflect.getMetadata(METADATA_KEYS.TESTS, testFixture);

		Expect(tests.length).toBe(1);
	}

	@Test()
	public testCasesAddedAsMetaData() {
		const testCaseDecorator = TestCasesDecorator([]);

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

	@Test()
	public noTestsAddedOnNull() {
		const testCaseDecorator = TestCasesDecorator(null);
		const testFixture = {};

		testCaseDecorator(testFixture, "key", null);

		const testCases: Array<any> = Reflect.getMetadata(
			METADATA_KEYS.TEST_CASES,
			testFixture,
			"key"
		);

		Expect(testCases).toBeEmpty();
	}

	@TestCase([[]])
	@TestCase([[1], [2], [3]])
	@TestCase([["this"], ["that"], ["the other"]])
	public testCaseArgumentsFromArrayMetaDataAdded(
		expectedArguments: Array<Array<any>>
	) {
		const testCaseDecorator = TestCasesDecorator(expectedArguments);

		const testFixture = {};

		testCaseDecorator(testFixture, "key", null);

		const testCases = Reflect.getMetadata(
			METADATA_KEYS.TEST_CASES,
			testFixture,
			"key"
		);

		Expect(testCases[0].caseArguments).toEqual(expectedArguments[0]);
	}

	@TestCase([[]])
	@TestCase([[1], [2], [3]])
	@TestCase([["this"], ["that"], ["the other"]])
	public testCaseArgumentsFromArrayDelegateMetaDataAdded(
		expectedArguments: Array<Array<any>>
	) {
		const testCaseDecorator = TestCasesDecorator(() => expectedArguments);

		const testFixture = {};

		testCaseDecorator(testFixture, "key", null);

		const testCases = Reflect.getMetadata(
			METADATA_KEYS.TEST_CASES,
			testFixture,
			"key"
		);

		Expect(testCases[0].caseArguments).toEqual(expectedArguments[0]);
	}

	@TestCase([[]])
	@TestCase([[1], [2], [3]])
	@TestCase([["this"], ["that"], ["the other"]])
	public testCaseArgumentsFromGeneratorMetaDataAdded(
		expectedArguments: Array<Array<any>>
	) {
		function* generator(args: Array<Array<any>>) {
			for (const argument of args) {
				yield argument;
			}
		}

		const testCaseDecorator = TestCasesDecorator(
			generator(expectedArguments)
		);

		const testFixture = {};

		testCaseDecorator(testFixture, "key", null);

		const testCases = Reflect.getMetadata(
			METADATA_KEYS.TEST_CASES,
			testFixture,
			"key"
		);

		Expect(testCases[0].caseArguments).toEqual(expectedArguments[0]);
	}

	@TestCase([[]])
	@TestCase([[1], [2], [3]])
	@TestCase([["this"], ["that"], ["the other"]])
	public testCaseArgumentsFromGeneratorDelegateMetaDataAdded(
		expectedArguments: Array<Array<any>>
	) {
		function* makeGenerator() {
			for (const argument of expectedArguments) {
				yield argument;
			}
		}

		const testCaseDecorator = TestCasesDecorator(makeGenerator);

		const testFixture = {};

		testCaseDecorator(testFixture, "key", null);

		const testCases = Reflect.getMetadata(
			METADATA_KEYS.TEST_CASES,
			testFixture,
			"key"
		);

		Expect(testCases[0].caseArguments).toEqual(expectedArguments[0]);
	}

	@TestCase("key")
	@TestCase("another key")
	@TestCase("something-different")
	public testCaseKeyMetaDataAddedWithCorrectKey(key: string) {
		const testCaseDecorator = TestCasesDecorator([]);
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
		const dummyTestCaseDecorator = TestCasesDecorator([]);
		const testFixture = {};

		for (let i = 0; i < testCount; i++) {
			dummyTestCaseDecorator(testFixture, `key ${i}`, null);
		}

		const args = [[1, 2, 3]];
		TestCasesDecorator(args)(testFixture, "key", null);

		const testCases = Reflect.getMetadata(
			METADATA_KEYS.TEST_CASES,
			testFixture,
			"key"
		);

		Expect(testCases[0].caseArguments).toEqual(args[0]);
	}

	@Test("deprecation warning added")
	public deprecationWarningAdded() {
		SpyOn(Warner, "warn");

		TestCasesDecorator([]);

		Expect(Warner.warn).toHaveBeenCalledWith(
			"TestCases has been deprecated and will be removed in version 5.0.0. " +
				"Please switch to using the new TestProperties decorator."
		);
	}
}
