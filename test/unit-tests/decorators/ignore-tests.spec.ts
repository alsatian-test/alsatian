import "reflect-metadata";
import { Expect, METADATA_KEYS, Test, TestCase } from "../../../core/alsatian-core";
import { IgnoreTests as IgnoreTestsDecorator } from "../../../core/decorators/ignore-tests-decorator";

export class IgnoreTestsDecoratorTests {

    @Test()
    public focusTestKeyMetaDataAdded(key: string) {
        let ignoreTestsDecorator = IgnoreTestsDecorator();
        let testFixture = () => {};

        ignoreTestsDecorator(testFixture);
        Expect(Reflect.getMetadata(METADATA_KEYS.IGNORE, testFixture)).toBe(true);
    }

    @TestCase("Ignored because of bla bla bla")
    @TestCase("another reason for it being ignored")
    @TestCase("bla bla bla")
    public ignoreTestCorrectReasonAdded(reason: string) {
        let ignoreTestDecorator = IgnoreTestsDecorator(reason);
        let testFixture = () => {};

        ignoreTestDecorator(testFixture);

        Expect(Reflect.getMetadata(METADATA_KEYS.IGNORE_REASON, testFixture)).toBe(reason);
    }

}
