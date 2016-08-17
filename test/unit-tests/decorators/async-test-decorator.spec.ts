import "reflect-metadata";
import { AsyncTest as AsyncTestDecorator } from "../../../core/decorators/async-test-decorator";
import { Expect, Test, TestCase, METADATA_KEYS } from "../../../core/alsatian-core";

export class AsyncTestDecoratorTests {

   @Test()
   public testAddedAsMetaData() {
      let asyncTestDecorator = AsyncTestDecorator();

      let testFixture = {};

      asyncTestDecorator(testFixture, "test", null);

      let tests = Reflect.getMetadata(METADATA_KEYS.TESTS_KEY, testFixture);

      Expect(tests).toBeDefined();
      Expect(tests).not.toBeNull();
   }

    @Test()
    public testMetaDataMarkedAsAsync() {
       let asyncTestDecorator = AsyncTestDecorator();

       let testFixture = {};

       asyncTestDecorator(testFixture, "test", null);

       let tests = Reflect.getMetadata(METADATA_KEYS.TESTS_KEY, testFixture);

       Expect(tests[0].isAsync).toBe(true);
    }

    @TestCase("key")
    @TestCase("another key")
    @TestCase("something-different")
    public testKeyMetaDataAdded(key: string) {
       let asyncTestDecorator = AsyncTestDecorator();

       let testFixture = {};

       asyncTestDecorator(testFixture, key, null);

       let tests = Reflect.getMetadata(METADATA_KEYS.TESTS_KEY, testFixture);

       Expect(tests[0].key).toBe(key);
    }

     @TestCase("Some Test")
     @TestCase("Another sort of test")
     @TestCase("Make sure it works")
     public testDescriptionMetaDataAdded(description: string) {
        let asyncTestDecorator = AsyncTestDecorator(description);

        let testFixture = {};

        asyncTestDecorator(testFixture, "key", null);

        let tests = Reflect.getMetadata(METADATA_KEYS.TESTS_KEY, testFixture);

        Expect(tests[0].description).toBe(description);
     }

      @TestCase(1)
      @TestCase(2)
      @TestCase(42)
      public correctTestCountAdded(testCount: number) {
         let asyncTestDecorator = AsyncTestDecorator();

         let testFixture = {};

         for (let i = 0; i < testCount; i ++) {
           asyncTestDecorator(testFixture, "key " + i, null);
         }

         let tests = Reflect.getMetadata(METADATA_KEYS.TESTS_KEY, testFixture);

         Expect(tests.length).toBe(testCount);
      }

       @TestCase(1)
       @TestCase(2)
       @TestCase(42)
       public noDuplicateTestKeysAdded(testCount: number) {
          let testDecorator = AsyncTestDecorator();

          let testFixture = {};

          for (let i = 0; i < testCount; i ++) {
            testDecorator(testFixture, "key", null);
          }

          let tests = Reflect.getMetadata(METADATA_KEYS.TESTS_KEY, testFixture);

          Expect(tests.length).toBe(1);
       }
}
