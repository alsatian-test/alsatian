import "reflect-metadata";
import {
	Expect,
	METADATA_KEYS,
	Test,
	TestCase,
	SpyOn
} from "../../../core/alsatian-core";
import { Setup } from "../../../core/decorators/setup-decorator";
import { Warner } from "../../../core/maintenance/warn";

export class SetupDecoratorTests {
	@Test()
	public setupFunctionAddedAsMetaData() {
		const testFixture = {};

		Setup(testFixture, "test", undefined);

		const setupFunctions = Reflect.getMetadata(
			METADATA_KEYS.SETUP,
			testFixture
		);

		Expect(setupFunctions).toBeDefined();
		Expect(setupFunctions).not.toBeNull();
	}

	@TestCase("key")
	@TestCase("another key")
	@TestCase("something-different")
	public setupFunctionKeyMetaDataAdded(key: string) {
		const testFixture = {};

		Setup(testFixture, key, undefined);

		const setupFunctions = Reflect.getMetadata(
			METADATA_KEYS.SETUP,
			testFixture
		);

		Expect(setupFunctions[0].propertyKey).toBe(key);
	}

	@TestCase("key")
	@TestCase("another key")
	@TestCase("something-different")
	public setupFunctionIsAsyncMetaDataAdded(key: string) {
		const testFixture = {};

		Setup(testFixture, key, undefined);

		const setupFunctions = Reflect.getMetadata(
			METADATA_KEYS.SETUP,
			testFixture
		);

		Expect(setupFunctions[0].isAsync).toBe(false);
	}

	@TestCase(1)
	@TestCase(2)
	@TestCase(42)
	public correctTestCountAdded(setupFunctionCount: number) {
		const testFixture = {};

		for (let i = 0; i < setupFunctionCount; i++) {
			Setup(testFixture, "key " + i, undefined);
		}

		const setupFunctions = Reflect.getMetadata(
			METADATA_KEYS.SETUP,
			testFixture
		);

		Expect(setupFunctions.length).toBe(setupFunctionCount);
	}

	@Test("deprecation warning not added")
	public deprecationWarningNotAdded() {
		SpyOn(Warner, "warn");

		Setup({}, "");

		Expect(Warner.warn).not.toHaveBeenCalled();
	}
}
