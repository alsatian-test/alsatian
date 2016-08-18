import "reflect-metadata";
import { FocusTest as FocusTestDecorator } from "../../../core/decorators/focus-test-decorator";
import { Expect, Test, TestCase, METADATA_KEYS } from "../../../core/alsatian-core";

export class FocusTestDecoratorTests {

    @TestCase("key")
    @TestCase("another key")
    @TestCase("something-different")
    public focusTestKeyMetaDataAddedToCorrectKey(key: string) {

       let testFixture = {};

       FocusTestDecorator(testFixture, key, null);

       Expect(Reflect.getMetadata(METADATA_KEYS.FOCUS, testFixture, key)).toBe(true);
    }
}
