import { FunctionSpy } from "../../../../core/spying/function-spy";
import { Expect, Test, TestCase, SpyOn } from "../../../../core/alsatian-core";

export class ReturnTests {

   @TestCase(undefined)
   @TestCase(null)
   @TestCase(0)
   @TestCase(42)
   @TestCase(4.2)
   @TestCase(-4.2)
   @TestCase("")
   @TestCase("something")
   public givenReturnValueIsReturned(expectedReturnValue: any) {
      let object = {
         originalFunction: () => {}
      };

      SpyOn(object, "originalFunction");

      let originalFunction = object.originalFunction;

      let spy = new FunctionSpy();

      spy.andReturn(expectedReturnValue);

      let actualReturnValue = spy.call([]);

      Expect(actualReturnValue).toBe(expectedReturnValue);
   }
}
