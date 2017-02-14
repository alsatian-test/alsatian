import "reflect-metadata";
import { Expect, METADATA_KEYS, Test, TestCase, TestFixture } from "../../../core/alsatian-core";
import { SetupFixture } from "../../../core/decorators/setup-fixture-decorator";

@TestFixture("@SetupFixture decorator tests")
export class SetupFixtureDecoratorTests {

   @Test("setup fixture function added to metadata")
   public setupFixtureFunctionAddedAsMetaData() {

      const testFixture = {};

      SetupFixture(testFixture, "test", null);

      const setupFixtureFunctions = Reflect.getMetadata(METADATA_KEYS.SETUP_FIXTURE, testFixture);

      Expect(setupFixtureFunctions).toBeDefined();
      Expect(setupFixtureFunctions).not.toBeNull();
   }

    @TestCase("key")
    @TestCase("another key")
    @TestCase("something-different")
    @Test("setup fixture function added to metadata with correct key")
    public setupFixtureFunctionKeyMetaDataAdded(key: string) {

       const testFixture = {};

       SetupFixture(testFixture, key, null);

       const setupFixtureFunctions = Reflect.getMetadata(METADATA_KEYS.SETUP_FIXTURE, testFixture);

       Expect(setupFixtureFunctions[0].propertyKey).toBe(key);
    }

    @TestCase("key")
    @TestCase("another key")
    @TestCase("something-different")
    @Test("setup fixture function added to metadata with isAsync = false")
    public setupFixtureFunctionIsAsyncMetaDataAdded(key: string) {

       const testFixture = {};

       SetupFixture(testFixture, key, null);

       const setupFixtureFunctions = Reflect.getMetadata(METADATA_KEYS.SETUP_FIXTURE, testFixture);

       Expect(setupFixtureFunctions[0].isAsync).toBe(false);
    }

    @TestCase(1)
    @TestCase(2)
    @TestCase(42)
    @Test("multiple setup fixture functions added to metadata")
    public correctTestCountAdded(setupFixtureFunctionCount: number) {

       const testFixture = {};

       for (let i = 0; i < setupFixtureFunctionCount; i ++) {
         SetupFixture(testFixture, "key " + i, null);
       }

       const setupFixtureFunctions = Reflect.getMetadata(METADATA_KEYS.SETUP_FIXTURE, testFixture);

       Expect(setupFixtureFunctions.length).toBe(setupFixtureFunctionCount);
    }
}
