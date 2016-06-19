import "reflect-metadata";
import { FocusTest as FocusTestDecorator } from "../../../core/decorators/focus-test-decorator";
import { Expect, Test, TestCase } from "../../../core/alsatian-core";

export class TestDecoratorTests {

    @TestCase("key")
    @TestCase("another key")
    @TestCase("something-different")
    public focusTestKeyMetaDataAddedToCorrectKey(key: string) {

       let testFixture = {};

       FocusTestDecorator(testFixture, key, null);

       Expect(Reflect.getMetadata("alsatian:focus", testFixture, key)).toBe(true);
    }
}
