import "reflect-metadata";
import { TestFixture as TestFixtureDecorator } from "../../../core/decorators/test-fixture-decorator";
import { Expect, Test, TestFixture, TestCase, METADATA_KEYS, FocusTests } from "../../../core/alsatian-core";

@FocusTests
@TestFixture("Test Fixture Decorator Tests")
export class TestFixtureDecoratorTests {

    @Test()
    public metaDataIsSet() {
        const testFixtureDecorator = TestFixtureDecorator();

        const testFixtureConstructor = () => {};

        testFixtureDecorator(testFixtureConstructor);

        const testFixtureMetadata = Reflect.getMetadata(METADATA_KEYS.TEST_FIXTURE, testFixtureConstructor);

        Expect(testFixtureMetadata).toBeDefined();
        Expect(testFixtureMetadata).not.toBeNull();
    }
}