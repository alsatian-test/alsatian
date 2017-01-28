import "reflect-metadata";
import { Expect, METADATA_KEYS, Test, TestCase, TestFixture } from "../../../core/alsatian-core";
import { AsyncSetupFixture } from "../../../core/decorators/async-setup-fixture-decorator";

@TestFixture("@AsyncAsyncSetupFixture decorator tests")
export class AsyncSetupFixtureDecoratorTests {

   @Test("async setup fixture function added to metadata")
   public asyncSetupFixtureFunctionAddedAsMetaData() {

      const testFixture = {};

      AsyncSetupFixture(testFixture, "test", null);

      const asyncSetupFixtureFunctions = Reflect.getMetadata(METADATA_KEYS.SETUP_FIXTURE, testFixture);

      Expect(asyncSetupFixtureFunctions).toBeDefined();
      Expect(asyncSetupFixtureFunctions).not.toBeNull();
   }

    @TestCase("key")
    @TestCase("another key")
    @TestCase("something-different")
    @Test("async setup fixture function added to metadata with correct key")
    public asyncSetupFixtureFunctionKeyMetaDataAdded(key: string) {

       const testFixture = {};

       AsyncSetupFixture(testFixture, key, null);

       const asyncSetupFixtureFunctions = Reflect.getMetadata(METADATA_KEYS.SETUP_FIXTURE, testFixture);

       Expect(asyncSetupFixtureFunctions[0].propertyKey).toBe(key);
    }

    @TestCase("key")
    @TestCase("another key")
    @TestCase("something-different")
    @Test("async setup fixture function added to metadata with isAsync = true")
    public asyncSetupFixtureFunctionIsAsyncMetaDataAdded(key: string) {

       const testFixture = {};

       AsyncSetupFixture(testFixture, key, null);

       const asyncSetupFixtureFunctions = Reflect.getMetadata(METADATA_KEYS.SETUP_FIXTURE, testFixture);

       Expect(asyncSetupFixtureFunctions[0].isAsync).toBe(true);
    }

    @TestCase(1)
    @TestCase(2)
    @TestCase(42)
    @Test("multiple async setup fixture functions added to metadata")
    public correctTestCountAdded(asyncSetupFixtureFunctionCount: number) {

       const testFixture = {};

       for (let i = 0; i < asyncSetupFixtureFunctionCount; i ++) {
         AsyncSetupFixture(testFixture, "key " + i, null);
       }

       const asyncSetupFixtureFunctions = Reflect.getMetadata(METADATA_KEYS.SETUP_FIXTURE, testFixture);

       Expect(asyncSetupFixtureFunctions.length).toBe(asyncSetupFixtureFunctionCount);
    }
}
