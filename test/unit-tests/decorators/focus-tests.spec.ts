import "reflect-metadata";
import { FocusTests as FocusTestsDecorator } from "../../../core/decorators/focus-tests-decorator";
import { Expect, Test, TestCase, METADATA_KEYS } from "../../../core/alsatian-core";

export class FocusTestsDecoratorTests {

    @Test()
    public focusTestKeyMetaDataAdded(key: string) {

       let TestFixture = () => {};

       FocusTestsDecorator(TestFixture);

       Expect(Reflect.getMetadata(METADATA_KEYS.FOCUS, TestFixture)).toBe(true);
    }
}
