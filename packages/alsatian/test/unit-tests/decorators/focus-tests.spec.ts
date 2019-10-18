import "reflect-metadata";
import {
	Expect,
	METADATA_KEYS,
	Test,
	TestCase,
	SpyOn
} from "../../../core/alsatian-core";
import { FocusTests as FocusTestsDecorator } from "../../../core/decorators/focus-tests-decorator";
import { Warner } from "../../../core/maintenance/warn";

export class FocusTestsDecoratorTests {
	@Test()
	public focusTestKeyMetaDataAdded(key: string) {
		class TestFixtureClass {}

		FocusTestsDecorator(TestFixtureClass);

		Expect(Reflect.getMetadata(METADATA_KEYS.FOCUS, TestFixtureClass)).toBe(
			true
		);
	}

	@Test("deprecation warning added")
	public deprecationWarningAdded() {
		SpyOn(Warner, "warn");

		class TestFixtureClass {}

		FocusTestsDecorator(TestFixtureClass);

		Expect(Warner.warn).toHaveBeenCalledWith(
			"FocusTests has been deprecated and will be removed in version 4.0.0. " +
				"Use the Focus decorator instead."
		);
	}
}
