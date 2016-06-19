import "reflect-metadata";
import { FocusTests as FocusTestsDecorator } from "../../../core/decorators/focus-tests-decorator";
import { Expect, Test, TestCase } from "../../../core/alsatian-core";

export class FocusTestsDecoratorTests {

    @Test()
    public focusTestKeyMetaDataAdded(key: string) {

       let TestFixture = () => {};

       FocusTestsDecorator(TestFixture);

       Expect(Reflect.getMetadata("alsatian:focus", TestFixture)).toBe(true);
    }
}
