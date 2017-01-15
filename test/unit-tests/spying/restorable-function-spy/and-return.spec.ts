import { Expect, SpyOn, Test, TestCase } from "../../../../core/alsatian-core";
import { RestorableFunctionSpy } from "../../../../core/spying/restorable-function-spy";

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
         originalFunction: () => undefined
      };

      SpyOn(object, "originalFunction");

      let originalFunction = object.originalFunction;

      let spy = new RestorableFunctionSpy(object, "originalFunction");

      spy.andReturn(expectedReturnValue);

      let actualReturnValue = spy.call([]);

      Expect(actualReturnValue).toBe(expectedReturnValue);
   }
}
