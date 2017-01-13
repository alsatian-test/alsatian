import "reflect-metadata";
import { Teardown } from "../../../core/decorators/teardown-decorator";
import { Expect, Test, TestCase, METADATA_KEYS } from "../../../core/alsatian-core";

export class TeardownDecoratorTests {

   @Test()
   public teardownFunctionAddedAsMetaData() {

      let testFixture = {};

      Teardown(testFixture, "test", null);

      let teardownFunctions = Reflect.getMetadata(METADATA_KEYS.TEARDOWN, testFixture);

      Expect(teardownFunctions).toBeDefined();
      Expect(teardownFunctions).not.toBeNull();
   }

    @TestCase("key")
    @TestCase("another key")
    @TestCase("something-different")
    public teardownFunctionMetaDataAdded(key: string) {

       let testFixture = {};

       Teardown(testFixture, key, null);

       let teardownFunctions = Reflect.getMetadata(METADATA_KEYS.TEARDOWN, testFixture);

       Expect(teardownFunctions[0].propertyKey).toBe(key);
    }

    @TestCase("key")
    @TestCase("another key")
    @TestCase("something-different")
    public teardownFunctionIsAsyncMetaDataAdded(key: string) {

       const testFixture = {};

       Teardown(testFixture, key, null);

       const teardownFunctions = Reflect.getMetadata(METADATA_KEYS.TEARDOWN, testFixture);

       Expect(teardownFunctions[0].isAsync).toBe(false);
    }

    @TestCase(1)
    @TestCase(2)
    @TestCase(42)
    public correctTestCountAdded(teardownFunctionCount: number) {

       let testFixture = {};

       for (let i = 0; i < teardownFunctionCount; i ++) {
         Teardown(testFixture, "key " + i, null);
       }

       let teardownFunctions = Reflect.getMetadata(METADATA_KEYS.TEARDOWN, testFixture);

       Expect(teardownFunctions.length).toBe(teardownFunctionCount);
    }
}
