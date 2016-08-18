import "reflect-metadata";
import { IgnoreTests as IgnoreTestsDecorator } from "../../../core/decorators/ignore-tests-decorator";
import { Expect, Test, TestCase, METADATA_KEYS } from "../../../core/alsatian-core";

export class IgnoreTestsDecoratorTests {

    @Test()
    public focusTestKeyMetaDataAdded(key: string) {
        let ignoreTestsDecorator = IgnoreTestsDecorator();
        let TestFixture = () => {};

        ignoreTestsDecorator(TestFixture);
        Expect(Reflect.getMetadata(METADATA_KEYS.IGNORE, TestFixture)).toBe(true);
    }

    @TestCase("Ignored because of bla bla bla")
    @TestCase("another reason for it being ignored")
    @TestCase("bla bla bla")
    public ignoreTestCorrectReasonAdded(reason: string) {
        let ignoreTestDecorator = IgnoreTestsDecorator(reason);
        let TestFixture = () => {};

        ignoreTestDecorator(TestFixture);

        Expect(Reflect.getMetadata(METADATA_KEYS.IGNORE_REASON, TestFixture)).toBe(reason);
    }

}
