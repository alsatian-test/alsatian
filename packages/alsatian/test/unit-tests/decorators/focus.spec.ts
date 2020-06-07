import "reflect-metadata";
import {
	Expect,
	METADATA_KEYS,
	Test,
	TestCase
} from "../../../core/alsatian-core";
import { Focus } from "../../../core/decorators/focus-decorator";

export class FocusTestDecoratorTests {
	@TestCase("key")
	@TestCase("another key")
	@TestCase("something-different")
	public focusTestKeyMetaDataAddedToCorrectKey(key: string) {
		const testFixture = {};

		Focus(testFixture, key);

		Expect(Reflect.getMetadata(METADATA_KEYS.FOCUS, testFixture, key)).toBe(
			true
		);
	}

	@Test()
	public focusTestKeyMetaDataAdded(key: string) {
		class TestFixtureClass {}

		Focus(TestFixtureClass);

		Expect(Reflect.getMetadata(METADATA_KEYS.FOCUS, TestFixtureClass)).toBe(
			true
		);
	}
}
