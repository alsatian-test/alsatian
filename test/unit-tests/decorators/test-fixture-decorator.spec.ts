import "reflect-metadata";
import { TestFixture as TestFixtureMetadata } from "../../../core/";
import { Expect, METADATA_KEYS, SpyOnProperty, Test, TestCase, TestFixture } from "../../../core/alsatian-core";
import { TestFixture as TestFixtureDecorator } from "../../../core/decorators/test-fixture-decorator";

@TestFixture("Test Fixture Decorator Tests")
export class TestFixtureDecoratorTests {

    @Test()
    public metaDataIsSet() {
        const testFixtureDecorator = TestFixtureDecorator();

        class TestFixtureClass { }

        testFixtureDecorator(TestFixtureClass);

        const testFixtureMetadata = Reflect.getMetadata(METADATA_KEYS.TEST_FIXTURE, TestFixtureClass);

        Expect(testFixtureMetadata).toBeDefined();
        Expect(testFixtureMetadata).not.toBeNull();
    }

    @Test()
    public metaDataIsTestFixture() {
        const testFixtureDecorator = TestFixtureDecorator();

        class TestFixtureClass { }

        testFixtureDecorator(TestFixtureClass);

        const testFixtureMetadata = Reflect.getMetadata(METADATA_KEYS.TEST_FIXTURE, TestFixtureClass);

        Expect(testFixtureMetadata instanceof TestFixtureMetadata).toBe(true);
    }

    @TestCase("something")
    @TestCase("wow, this is super!")
    @TestCase("Mega Hyper AWESOME test...")
    public testFixtureMetadataDescriptionSet(testFixtureDescription: string) {
        const testFixtureDecorator = TestFixtureDecorator(testFixtureDescription);

        class TestFixtureClass { }

        testFixtureDecorator(TestFixtureClass);

        const testFixtureMetadata = Reflect.getMetadata(METADATA_KEYS.TEST_FIXTURE, TestFixtureClass);

        Expect(testFixtureMetadata.description).toBe(testFixtureDescription);
    }

    @Test()
    public testFixtureMetadataDescriptionDefaultsToClassName() {
        const testFixtureDecorator = TestFixtureDecorator();

        class ExampleTestFixture { }
        testFixtureDecorator(ExampleTestFixture);

        class SomeOtherTestFixture { }
        testFixtureDecorator(SomeOtherTestFixture);

        const testFixtureMetadata = Reflect.getMetadata(METADATA_KEYS.TEST_FIXTURE, ExampleTestFixture);
        const someOtherTestFixtureMetadata = Reflect.getMetadata(METADATA_KEYS.TEST_FIXTURE, SomeOtherTestFixture);

        Expect(testFixtureMetadata.description).toBe("ExampleTestFixture");
        Expect(someOtherTestFixtureMetadata.description).toBe("SomeOtherTestFixture");
    }

}
