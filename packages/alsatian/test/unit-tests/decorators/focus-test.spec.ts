import "reflect-metadata";
import {
	Expect,
	METADATA_KEYS,
	Test,
	TestCase,
	SpyOn
} from "../../../core/alsatian-core";
import { FocusTest as FocusTestDecorator } from "../../../core/decorators/focus-test-decorator";
import { Warner } from "../../../core/maintenance/warn";

export class FocusTestDecoratorTests {
	@TestCase("key")
	@TestCase("another key")
	@TestCase("something-different")
	public focusTestKeyMetaDataAddedToCorrectKey(key: string) {
		const testFixture = {};

		FocusTestDecorator(testFixture, key, null);

		Expect(Reflect.getMetadata(METADATA_KEYS.FOCUS, testFixture, key)).toBe(
			true
		);
	}

	@Test("deprecation warning added")
	public deprecationWarningAdded() {
		SpyOn(Warner, "warn");

		FocusTestDecorator({}, "");

		Expect(Warner.warn).toHaveBeenCalledWith(
			"FocusTest has been depreacated and will be removed in version 4.0.0. " +
				"Use the Focus decorator instead."
		);
	}
}
