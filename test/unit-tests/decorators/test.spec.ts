import "reflect-metadata";
import { Test as TestDecorator } from "../../../core/decorators/test-decorator";
import { Expect, Test, TestCase } from "../../../core/alsatian-core";

export class TestDecoratorTests {

   @Test()
   public noActualErrorShouldGiveCorrectMessage() {
      let testDecorator = TestDecorator();

      let testFixture = {};

      testDecorator(testFixture, "test", null);

      let tests = Reflect.getMetadata("alsatian:tests", testFixture);

      Expect(tests.length).toBe(1);
   }
}
