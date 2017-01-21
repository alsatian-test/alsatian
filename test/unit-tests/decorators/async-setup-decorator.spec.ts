import "reflect-metadata";
import { Expect, METADATA_KEYS, Test, TestCase } from "../../../core/alsatian-core";
import { AsyncSetup } from "../../../core/decorators/async-setup-decorator";

export class AsyncSetupDecoratorTests {

   @Test()
   public setupFunctionAddedAsMetaData() {

      const testFixture = {};

      AsyncSetup(testFixture, "test", null);

      const setupFunctions = Reflect.getMetadata(METADATA_KEYS.SETUP, testFixture);

      Expect(setupFunctions).toBeDefined();
      Expect(setupFunctions).not.toBeNull();
   }

    @TestCase("key")
    @TestCase("another key")
    @TestCase("something-different")
    public setupFunctionKeyMetaDataAdded(key: string) {

       const testFixture = {};

       AsyncSetup(testFixture, key, null);

       const setupFunctions = Reflect.getMetadata(METADATA_KEYS.SETUP, testFixture);

       Expect(setupFunctions[0].propertyKey).toBe(key);
    }

    @TestCase("key")
    @TestCase("another key")
    @TestCase("something-different")
    public setupFunctionIsAsyncMetaDataAdded(key: string) {

       const testFixture = {};

       AsyncSetup(testFixture, key, null);

       const setupFunctions = Reflect.getMetadata(METADATA_KEYS.SETUP, testFixture);

       Expect(setupFunctions[0].isAsync).toBe(true);
    }

    @TestCase(1)
    @TestCase(2)
    @TestCase(42)
    public correctTestCountAdded(setupFunctionCount: number) {

       const testFixture = {};

       for (let i = 0; i < setupFunctionCount; i ++) {
         AsyncSetup(testFixture, "key " + i, null);
       }

       const setupFunctions = Reflect.getMetadata(METADATA_KEYS.SETUP, testFixture);

       Expect(setupFunctions.length).toBe(setupFunctionCount);
    }
}
