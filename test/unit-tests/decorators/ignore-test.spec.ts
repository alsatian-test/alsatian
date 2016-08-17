import "reflect-metadata";
import { IgnoreTest as IgnoreTestDecorator } from "../../../core/decorators/ignore-test-decorator";
import { Expect, Test, TestCase } from "../../../core/alsatian-core";

export class IgnoreTestDecoratorTests {

    @TestCase("key")
    @TestCase("another key")
    @TestCase("something-different")
    public ignoreTestKeyMetaDataAddedToCorrectKey(key: string) {
        let ignoreTestDecorator = IgnoreTestDecorator();
        let testFixture = {};

        ignoreTestDecorator(testFixture, key, null);

        let ignoreMetadata = Reflect.getMetadata("alsatian:ignore", testFixture, key);

        Expect(ignoreMetadata).not.toBe(undefined);
        Expect(ignoreMetadata).not.toBe(null);
    }

    @Test()
    public ignoreTestIgnoredSetToTrue() {
        let key = "testKey";

        let ignoreTestDecorator = IgnoreTestDecorator();
        let testFixture = {};

        ignoreTestDecorator(testFixture, key, null);

        let ignoreMetadata = Reflect.getMetadata("alsatian:ignore", testFixture, key);

        Expect(ignoreMetadata.ignored).toBe(true);
    }

    @TestCase("Ignored because of bla bla bla")
    @TestCase("another reason for it being ignored")
    @TestCase("bla bla bla")
    public ignoreTestCorrectReasonAdded(reason: string) {
        let key = "testKey";

        let ignoreTestDecorator = IgnoreTestDecorator(reason);
        let testFixture = {};

        ignoreTestDecorator(testFixture, key, null);

        let ignoreMetadata = Reflect.getMetadata("alsatian:ignore", testFixture, key);

        Expect(ignoreMetadata.reason).toBe(reason);
    }

}
