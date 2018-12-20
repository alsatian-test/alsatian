import "reflect-metadata";
import {
	Expect,
	METADATA_KEYS,
	Test,
	TestCase,
	SpyOn
} from "../../../core/alsatian-core";
import { Test as TestDecorator } from "../../../core/decorators/test-decorator";
import { Warner } from "../../../core/maintenance/warn";

export class TestDecoratorTests {
	@Test()
	public testAddedAsMetaData() {
		const testDecorator = TestDecorator();

		const testFixture = {};

		testDecorator(testFixture, "test", null);

		const tests = Reflect.getMetadata(METADATA_KEYS.TESTS, testFixture);

		Expect(tests).toBeDefined();
		Expect(tests).not.toBeNull();
	}

	@TestCase("key")
	@TestCase("another key")
	@TestCase("something-different")
	public testKeyMetaDataAdded(key: string) {
		const testDecorator = TestDecorator();

		const testFixture = {};

		testDecorator(testFixture, key, null);

		const tests = Reflect.getMetadata(METADATA_KEYS.TESTS, testFixture);

		Expect(tests[0].key).toBe(key);
	}

	@TestCase(1)
	@TestCase(2)
	@TestCase(42)
	public correctTestCountAdded(testCount: number) {
		const testDecorator = TestDecorator();

		const testFixture = {};

		for (let i = 0; i < testCount; i++) {
			testDecorator(testFixture, "key " + i, null);
		}

		const tests = Reflect.getMetadata(METADATA_KEYS.TESTS, testFixture);

		Expect(tests.length).toBe(testCount);
	}

	@TestCase(1)
	@TestCase(2)
	@TestCase(42)
	public noDuplicateTestKeysAdded(testCount: number) {
		const testDecorator = TestDecorator();

		const testFixture = {};

		for (let i = 0; i < testCount; i++) {
			testDecorator(testFixture, "key", null);
		}

		const tests = Reflect.getMetadata(METADATA_KEYS.TESTS, testFixture);

		Expect(tests.length).toBe(1);
	}

	@Test("deprecation warning not added")
	public deprecationWarningNotAdded() {
		SpyOn(Warner, "warn");

		TestDecorator("");

		Expect(Warner.warn).not.toHaveBeenCalled();
	}
}
