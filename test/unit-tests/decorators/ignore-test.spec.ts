import "reflect-metadata";
import { IgnoreTest as IgnoreTestDecorator } from "../../../core/decorators/ignore-test-decorator";
import { Expect, Test, TestCase } from "../../../core/alsatian-core";

export class IgnoreTestDecoratorTests {

    @TestCase("key")
    @TestCase("another key")
    @TestCase("something-different")
    public ignoreTestKeyMetaDataAddedToCorrectKey(key: string) {

       let testFixture = {};

       IgnoreTestDecorator(testFixture, key, null);

       Expect(Reflect.getMetadata("alsatian:ignore", testFixture, key)).toBe(true);
    }
}
