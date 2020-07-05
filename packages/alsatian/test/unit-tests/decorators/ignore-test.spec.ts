import "reflect-metadata";
import {
	Expect,
	METADATA_KEYS,
	Test,
	TestCase,
	SpyOn
} from "../../../core/alsatian-core";
import { IgnoreTest as IgnoreTestDecorator } from "../../../core/decorators/ignore-test-decorator";
import { Warner } from "../../../core/maintenance/warn";

export class IgnoreTestDecoratorTests {
	@TestCase("key")
	@TestCase("another key")
	@TestCase("something-different")
	public ignoreTestKeyMetaDataAddedToCorrectKey(key: string) {
		const ignoreTestDecorator = IgnoreTestDecorator();
		const testFixture = {};

		ignoreTestDecorator(testFixture, key, undefined);

		Expect(
			Reflect.getMetadata(METADATA_KEYS.IGNORE, testFixture, key)
		).toBe(true);
	}

	@TestCase("Ignored because of bla bla bla")
	@TestCase("another reason for it being ignored")
	@TestCase("bla bla bla")
	public ignoreTestCorrectReasonAdded(reason: string) {
		const key = "testKey";

		const ignoreTestDecorator = IgnoreTestDecorator(reason);
		const testFixture = {};

		ignoreTestDecorator(testFixture, key, undefined);

		Expect(
			Reflect.getMetadata(METADATA_KEYS.IGNORE_REASON, testFixture, key)
		).toBe(reason);
	}

	@Test("deprecation warning added")
	public deprecationWarningAdded() {
		SpyOn(Warner, "warn");

		IgnoreTestDecorator("")({}, "");

		Expect(Warner.warn).toHaveBeenCalledWith(
			"IgnoreTest has been deprecated and will be removed in version 4.0.0. " +
				"Use the Ignore decorator instead."
		);
	}
}
