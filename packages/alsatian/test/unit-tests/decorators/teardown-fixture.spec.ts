import "reflect-metadata";
import {
	Expect,
	METADATA_KEYS,
	Test,
	TestCase,
	TestFixture,
	SpyOn
} from "../../../core/alsatian-core";
import { TeardownFixture } from "../../../core/decorators/teardown-fixture-decorator";
import { Warner } from "../../../core/maintenance/warn";

@TestFixture("@TeardownFixture decorator tests")
export class TeardownFixtureDecoratorTests {
	@Test("teardown fixture function added to metadata")
	public teardownFixtureFunctionAddedAsMetaData() {
		const testFixture = {};

		TeardownFixture(testFixture, "test", undefined);

		const teardownFixtureFunctions = Reflect.getMetadata(
			METADATA_KEYS.TEARDOWN_FIXTURE,
			testFixture
		);

		Expect(teardownFixtureFunctions).toBeDefined();
		Expect(teardownFixtureFunctions).not.toBeNull();
	}

	@TestCase("key")
	@TestCase("another key")
	@TestCase("something-different")
	@Test("teardown fixture function added to metadata with correct key")
	public teardownFixtureFunctionKeyMetaDataAdded(key: string) {
		const testFixture = {};

		TeardownFixture(testFixture, key, undefined);

		const teardownFixtureFunctions = Reflect.getMetadata(
			METADATA_KEYS.TEARDOWN_FIXTURE,
			testFixture
		);

		Expect(teardownFixtureFunctions[0].propertyKey).toBe(key);
	}

	@TestCase(1)
	@TestCase(2)
	@TestCase(42)
	@Test("multiple teardown fixture functions added to metadata")
	public correctTestCountAdded(teardownFixtureFunctionCount: number) {
		const testFixture = {};

		for (let i = 0; i < teardownFixtureFunctionCount; i++) {
			TeardownFixture(testFixture, "key " + i, undefined);
		}

		const teardownFixtureFunctions = Reflect.getMetadata(
			METADATA_KEYS.TEARDOWN_FIXTURE,
			testFixture
		);

		Expect(teardownFixtureFunctions.length).toBe(
			teardownFixtureFunctionCount
		);
	}

	@Test("deprecation warning not added")
	public deprecationWarningNotAdded() {
		SpyOn(Warner, "warn");

		TeardownFixture({}, "");

		Expect(Warner.warn).not.toHaveBeenCalled();
	}
}
