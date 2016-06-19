import "reflect-metadata";
import { Test as TestDecorator } from "../../../core/decorators/test-decorator";
import { Expect, Test, TestCase } from "../../../core/alsatian-core";

export class TestDecoratorTests {

   @Test()
   public testAddedAsMetaData() {
      let testDecorator = TestDecorator();

      let testFixture = {};

      testDecorator(testFixture, "test", null);

      let tests = Reflect.getMetadata("alsatian:tests", testFixture);

      Expect(tests).toBeDefined();
      Expect(tests).not.toBeNull();
   }

    @TestCase("key")
    @TestCase("another key")
    @TestCase("something-different")
    public testKeyMetaDataAdded(key: string) {
       let testDecorator = TestDecorator();

       let testFixture = {};

       testDecorator(testFixture, key, null);

       let tests = Reflect.getMetadata("alsatian:tests", testFixture);

       Expect(tests[0].key).toBe(key);
    }

     @TestCase("Some Test")
     @TestCase("Another sort of test")
     @TestCase("Make sure it works")
     public testDescriptionMetaDataAdded(description: string) {
        let testDecorator = TestDecorator();

        let testFixture = {};

        testDecorator(testFixture, "key", description);

        let tests = Reflect.getMetadata("alsatian:tests", testFixture);

        Expect(tests[0].description).toBe(description);
     }

      @TestCase(1)
      @TestCase(2)
      @TestCase(42)
      public correctTestCountAdded(testCount: number) {
         let testDecorator = TestDecorator();

         let testFixture = {};

         for (var i = 0; i < testCount; i ++) {
           testDecorator(testFixture, "key " + i, null);
         }

         let tests = Reflect.getMetadata("alsatian:tests", testFixture);

         Expect(tests.length).toBe(testCount);
      }

       @TestCase(1)
       @TestCase(2)
       @TestCase(42)
       public noDuplicateTestKeysAdded(testCount: number) {
          let testDecorator = TestDecorator();

          let testFixture = {};

          for (var i = 0; i < testCount; i ++) {
            testDecorator(testFixture, "key", null);
          }

          let tests = Reflect.getMetadata("alsatian:tests", testFixture);

          Expect(tests.length).toBe(1);
       }
}
