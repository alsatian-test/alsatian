import "reflect-metadata";
import { Teardown } from "../../../core/decorators/teardown-decorator";
import { Expect, Test, TestCase } from "../../../core/alsatian-core";

export class TeardownDecoratorTests {

   @Test()
   public teardownFunctionAddedAsMetaData() {

      let testFixture = {};

      Teardown(testFixture, "test", null);

      let teardownFunctions = Reflect.getMetadata("alsatian:teardown", testFixture);

      Expect(teardownFunctions).toBeDefined();
      Expect(teardownFunctions).not.toBeNull();
   }

    @TestCase("key")
    @TestCase("another key")
    @TestCase("something-different")
    public teardownFunctionMetaDataAdded(key: string) {

       let testFixture = {};

       Teardown(testFixture, key, null);

       let teardownFunctions = Reflect.getMetadata("alsatian:teardown", testFixture);

       Expect(teardownFunctions[0]).toBe(key);
    }

    @TestCase(1)
    @TestCase(2)
    @TestCase(42)
    public correctTestCountAdded(teardownFunctionCount: number) {

       let testFixture = {};

       for (var i = 0; i < teardownFunctionCount; i ++) {
         Teardown(testFixture, "key " + i, null);
       }

       let teardownFunctions = Reflect.getMetadata("alsatian:teardown", testFixture);

       Expect(teardownFunctions.length).toBe(teardownFunctionCount);
    }
}
