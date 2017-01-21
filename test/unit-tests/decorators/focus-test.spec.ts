import "reflect-metadata";
import { Expect, METADATA_KEYS, Test, TestCase } from "../../../core/alsatian-core";
import { FocusTest as FocusTestDecorator } from "../../../core/decorators/focus-test-decorator";

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
