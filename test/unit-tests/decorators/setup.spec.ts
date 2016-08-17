import "reflect-metadata";
import { Setup } from "../../../core/decorators/setup-decorator";
import { Expect, Test, TestCase, METADATA_KEYS } from "../../../core/alsatian-core";

export class SetupDecoratorTests {

   @Test()
   public setupFunctionAddedAsMetaData() {

      let testFixture = {};

      Setup(testFixture, "test", null);

      let setupFunctions = Reflect.getMetadata(METADATA_KEYS.SETUP_KEY, testFixture);

      Expect(setupFunctions).toBeDefined();
      Expect(setupFunctions).not.toBeNull();
   }

    @TestCase("key")
    @TestCase("another key")
    @TestCase("something-different")
    public setupFunctionMetaDataAdded(key: string) {

       let testFixture = {};

       Setup(testFixture, key, null);

       let setupFunctions = Reflect.getMetadata(METADATA_KEYS.SETUP_KEY, testFixture);

       Expect(setupFunctions[0]).toBe(key);
    }

    @TestCase(1)
    @TestCase(2)
    @TestCase(42)
    public correctTestCountAdded(setupFunctionCount: number) {

       let testFixture = {};

       for (let i = 0; i < setupFunctionCount; i ++) {
         Setup(testFixture, "key " + i, null);
       }

       let setupFunctions = Reflect.getMetadata(METADATA_KEYS.SETUP_KEY, testFixture);

       Expect(setupFunctions.length).toBe(setupFunctionCount);
    }
}
