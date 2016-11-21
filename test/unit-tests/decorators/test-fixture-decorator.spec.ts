import "reflect-metadata";
import { TestFixture as TestFixtureDecorator } from "../../../core/decorators/test-fixture-decorator";
import { Expect, Test, TestFixture, TestCase, METADATA_KEYS, SpyOnProperty } from "../../../core/alsatian-core";
import { TestFixture as TestFixtureMetadata } from "../../../core/_core";

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

    @Test()
    public metaDataIsTestFixture() {
        const testFixtureDecorator = TestFixtureDecorator();

        const testFixtureConstructor = () => {};

        testFixtureDecorator(testFixtureConstructor);

        const testFixtureMetadata = Reflect.getMetadata(METADATA_KEYS.TEST_FIXTURE, testFixtureConstructor);

        Expect(testFixtureMetadata instanceof TestFixtureMetadata).toBe(true);
    }

    @TestCase("something")
    @TestCase("wow, this is super!")
    @TestCase("Mega Hyper AWESOME test...")
    public testFixtureMetadataDescriptionSet(testFixtureDescription: string) {
        const testFixtureDecorator = TestFixtureDecorator(testFixtureDescription);

        const testFixtureConstructor = () => {};

        testFixtureDecorator(testFixtureConstructor);

        const testFixtureMetadata = Reflect.getMetadata(METADATA_KEYS.TEST_FIXTURE, testFixtureConstructor);

        Expect(testFixtureMetadata.description).toBe(testFixtureDescription);
    }

    @TestCase("Class")
    @TestCase("TestFixture")
    @TestCase("MegaHyperAwesomeTests")
    public testFixtureMetadataDescriptionDefaultsToConstructorName(testFixtureClassName: string) {
        const testFixtureDecorator = TestFixtureDecorator();

        const testFixtureConstructor = () => {};
        SpyOnProperty(testFixtureConstructor, "name").andReturnValue(testFixtureClassName);

        testFixtureDecorator(testFixtureConstructor);

        const testFixtureMetadata = Reflect.getMetadata(METADATA_KEYS.TEST_FIXTURE, testFixtureConstructor);

        Expect(testFixtureMetadata.description).toBe(testFixtureClassName);
    }
}