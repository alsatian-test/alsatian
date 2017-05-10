import "reflect-metadata";
import { TestFixture as TestFixtureMetadata } from "../../../core/";
import { Expect, METADATA_KEYS, SpyOnProperty, Test, TestCase, TestFixture } from "../../../core/alsatian-core";
import { TestFixture as TestFixtureDecorator } from "../../../core/decorators/test-fixture-decorator";
import { ClassBuilder } from "../../builders/class-builder";

@TestFixture("Test Fixture Decorator Tests")
export class TestFixtureDecoratorTests {

    @Test()
    public metaDataIsSet() {
        const testFixtureDecorator = TestFixtureDecorator();

        const testFixtureConstructor = new ClassBuilder().build();

        testFixtureDecorator(testFixtureConstructor);

        const testFixtureMetadata = Reflect.getMetadata(METADATA_KEYS.TEST_FIXTURE, testFixtureConstructor);

        Expect(testFixtureMetadata).toBeDefined();
        Expect(testFixtureMetadata).not.toBeNull();
    }

    @Test()
    public metaDataIsTestFixture() {
        const testFixtureDecorator = TestFixtureDecorator();

        const testFixtureConstructor = new ClassBuilder().build();

        testFixtureDecorator(testFixtureConstructor);

        const testFixtureMetadata = Reflect.getMetadata(METADATA_KEYS.TEST_FIXTURE, testFixtureConstructor);

        Expect(testFixtureMetadata instanceof TestFixtureMetadata).toBe(true);
    }

    @TestCase("something")
    @TestCase("wow, this is super!")
    @TestCase("Mega Hyper AWESOME test...")
    public testFixtureMetadataDescriptionSet(testFixtureDescription: string) {
        const testFixtureDecorator = TestFixtureDecorator(testFixtureDescription);

        const testFixtureConstructor = new ClassBuilder().build();

        testFixtureDecorator(testFixtureConstructor);

        const testFixtureMetadata = Reflect.getMetadata(METADATA_KEYS.TEST_FIXTURE, testFixtureConstructor);

        Expect(testFixtureMetadata.description).toBe(testFixtureDescription);
    }

    @TestCase("Class")
    @TestCase("TestFixture")
    @TestCase("MegaHyperAwesomeTests")
    public testFixtureMetadataDescriptionDefaultsToConstructorName(testFixtureClassName: string) {
        const testFixtureDecorator = TestFixtureDecorator();

        const testFixtureConstructor = new ClassBuilder().withName(testFixtureClassName).build();

        testFixtureDecorator(testFixtureConstructor);

        const testFixtureMetadata = Reflect.getMetadata(METADATA_KEYS.TEST_FIXTURE, testFixtureConstructor);

        Expect(testFixtureMetadata.description).toBe(testFixtureClassName);
    }
}
