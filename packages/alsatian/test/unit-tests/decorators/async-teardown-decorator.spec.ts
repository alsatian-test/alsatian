import "reflect-metadata";
import {
	Expect,
	METADATA_KEYS,
	Test,
	TestCase,
	SpyOn
} from "../../../core/alsatian-core";
import { AsyncTeardown } from "../../../core/decorators/async-teardown-decorator";
import { Warner } from "../../../core/maintenance/warn";

export class AsyncTeardownDecoratorTests {
	@Test()
	public teardownFunctionAddedAsMetaData() {
		const testFixture = {};

		AsyncTeardown(testFixture, "test", null);

		const teardownFunctions = Reflect.getMetadata(
			METADATA_KEYS.TEARDOWN,
			testFixture
		);

		Expect(teardownFunctions).toBeDefined();
		Expect(teardownFunctions).not.toBeNull();
	}

	@TestCase("key")
	@TestCase("another key")
	@TestCase("something-different")
	public teardownFunctionKeyMetaDataAdded(key: string) {
		const testFixture = {};

		AsyncTeardown(testFixture, key, null);

		const teardownFunctions = Reflect.getMetadata(
			METADATA_KEYS.TEARDOWN,
			testFixture
		);

		Expect(teardownFunctions[0].propertyKey).toBe(key);
	}

	@TestCase("key")
	@TestCase("another key")
	@TestCase("something-different")
	public teardownFunctionIsAsyncMetaDataAdded(key: string) {
		const testFixture = {};

		AsyncTeardown(testFixture, key, null);

		const teardownFunctions = Reflect.getMetadata(
			METADATA_KEYS.TEARDOWN,
			testFixture
		);

		Expect(teardownFunctions[0].isAsync).toBe(true);
	}

	@TestCase(1)
	@TestCase(2)
	@TestCase(42)
	public correctTestCountAdded(teardownFunctionCount: number) {
		const testFixture = {};

		for (let i = 0; i < teardownFunctionCount; i++) {
			AsyncTeardown(testFixture, "key " + i, null);
		}

		const teardownFunctions = Reflect.getMetadata(
			METADATA_KEYS.TEARDOWN,
			testFixture
		);

		Expect(teardownFunctions.length).toBe(teardownFunctionCount);
	}

	@Test("deprecation warning added")
	public deprecationWarningAdded() {
		SpyOn(Warner, "warn");

		AsyncTeardown({}, "");

		Expect(Warner.warn).toHaveBeenCalledWith(
			"AsyncTeardown has been depreacated and will be removed in version 4.0.0. " +
				"Use the Teardown decorator instead."
		);
	}
}
