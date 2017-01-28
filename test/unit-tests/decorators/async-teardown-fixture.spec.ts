import "reflect-metadata";
import { Expect, METADATA_KEYS, Test, TestCase, TestFixture } from "../../../core/alsatian-core";
import { AsyncTeardownFixture } from "../../../core/decorators/async-teardown-fixture-decorator";

@TestFixture("@AsyncTeardownFixture decorator tests")
export class AsyncTeadownFixtureDecoratorTests {

   @Test("async teardown fixture function added to metadata")
   public asyncTeardownFixtureFunctionAddedAsMetaData() {

      const testFixture = {};

      AsyncTeardownFixture(testFixture, "test", null);

      const asyncTeardownFixtureFunctions = Reflect.getMetadata(METADATA_KEYS.TEARDOWN_FIXTURE, testFixture);

      Expect(asyncTeardownFixtureFunctions).toBeDefined();
      Expect(asyncTeardownFixtureFunctions).not.toBeNull();
   }

    @TestCase("key")
    @TestCase("another key")
    @TestCase("something-different")
    @Test("async teardown fixture function added to metadata with correct key")
    public asyncTeardownFixtureFunctionKeyMetaDataAdded(key: string) {

       const testFixture = {};

       AsyncTeardownFixture(testFixture, key, null);

       const asyncTeardownFixtureFunctions = Reflect.getMetadata(METADATA_KEYS.TEARDOWN_FIXTURE, testFixture);

       Expect(asyncTeardownFixtureFunctions[0].propertyKey).toBe(key);
    }

    @TestCase("key")
    @TestCase("another key")
    @TestCase("something-different")
    @Test("async teardown fixture function added to metadata with isAsync = true")
    public asyncTeardownFixtureFunctionIsAsyncMetaDataAdded(key: string) {

       const testFixture = {};

       AsyncTeardownFixture(testFixture, key, null);

       const asyncTeardownFixtureFunctions = Reflect.getMetadata(METADATA_KEYS.TEARDOWN_FIXTURE, testFixture);

       Expect(asyncTeardownFixtureFunctions[0].isAsync).toBe(true);
    }

    @TestCase(1)
    @TestCase(2)
    @TestCase(42)
    @Test("multiple async teardown fixture functions added to metadata")
    public correctTestCountAdded(asyncTeardownFixtureFunctionCount: number) {

       const testFixture = {};

       for (let i = 0; i < asyncTeardownFixtureFunctionCount; i ++) {
         AsyncTeardownFixture(testFixture, "key " + i, null);
       }

       const asyncTeardownFixtureFunctions = Reflect.getMetadata(METADATA_KEYS.TEARDOWN_FIXTURE, testFixture);

       Expect(asyncTeardownFixtureFunctions.length).toBe(asyncTeardownFixtureFunctionCount);
    }
}
