import "reflect-metadata";
import { Expect, METADATA_KEYS, Test, TestCase } from "../../../core/alsatian-core";
import { IgnoreTests as IgnoreTestsDecorator } from "../../../core/decorators/ignore-tests-decorator";
import { ClassBuilder } from "../../builders/class-builder";

export class IgnoreTestsDecoratorTests {

    @Test()
    public focusTestKeyMetaDataAdded(key: string) {
        const ignoreTestsDecorator = IgnoreTestsDecorator();
        const testFixture = new ClassBuilder().build();

        ignoreTestsDecorator(testFixture);
        Expect(Reflect.getMetadata(METADATA_KEYS.IGNORE, testFixture)).toBe(true);
    }

    @TestCase("Ignored because of bla bla bla")
    @TestCase("another reason for it being ignored")
    @TestCase("bla bla bla")
    public ignoreTestCorrectReasonAdded(reason: string) {
        const ignoreTestDecorator = IgnoreTestsDecorator(reason);
        const testFixture = new ClassBuilder().build();

        ignoreTestDecorator(testFixture);

        Expect(Reflect.getMetadata(METADATA_KEYS.IGNORE_REASON, testFixture)).toBe(reason);
    }

}
