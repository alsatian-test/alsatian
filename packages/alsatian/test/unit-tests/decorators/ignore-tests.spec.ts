import "reflect-metadata";
import {
	Expect,
	METADATA_KEYS,
	Test,
	TestCase,
	SpyOn
} from "../../../core/alsatian-core";
import { IgnoreTests as IgnoreTestsDecorator } from "../../../core/decorators/ignore-tests-decorator";
import { Warner } from "../../../core/maintenance/warn";

export class IgnoreTestsDecoratorTests {
	@Test()
	public focusTestKeyMetaDataAdded(key: string) {
		const ignoreTestsDecorator = IgnoreTestsDecorator();

		class TestFixtureClass {}

		ignoreTestsDecorator(TestFixtureClass);
		Expect(
			Reflect.getMetadata(METADATA_KEYS.IGNORE, TestFixtureClass)
		).toBe(true);
	}

	@TestCase("Ignored because of bla bla bla")
	@TestCase("another reason for it being ignored")
	@TestCase("bla bla bla")
	public ignoreTestCorrectReasonAdded(reason: string) {
		const ignoreTestDecorator = IgnoreTestsDecorator(reason);

		class TestFixtureClass {}

		ignoreTestDecorator(TestFixtureClass);

		Expect(
			Reflect.getMetadata(METADATA_KEYS.IGNORE_REASON, TestFixtureClass)
		).toBe(reason);
	}

	@Test("deprecation warning added")
	public deprecationWarningAdded() {
		SpyOn(Warner, "warn");

		IgnoreTestsDecorator("");

		Expect(Warner.warn).toHaveBeenCalledWith(
			"IgnoreTests has been deprecated and will be removed in version 4.0.0. " +
				"Use the Ignore decorator instead."
		);
	}
}
