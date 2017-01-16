import { Expect, SpyOn, Test, TestCase } from "../../../../core/alsatian-core";
import { RestorableFunctionSpy } from "../../../../core/spying/restorable-function-spy";

export class AndCallTests {

   @Test()
   public originalFunctionNotCalledIfSpyFaked() {
      let object = {
         originalFunction: () => {}
      };

      SpyOn(object, "originalFunction");

      let originalFunction = object.originalFunction;

      let spy = new RestorableFunctionSpy(object, "originalFunction");

      spy.andCall(() => {});

      spy.call([]);

      Expect(originalFunction).not.toHaveBeenCalled();
   }

   @TestCase(null)
   @TestCase(undefined)
   @TestCase(42)
   @TestCase("something")
   @TestCase({ an: "object" })
   @TestCase([ "an", "array" ])
   public spyShoulReturnCorrectValue(returnValue: any) {
      let someObject = {
         func: () => {}
      };

      SpyOn(someObject, "func").andCall(() => {
         return returnValue;
      });

      Expect(someObject.func()).toBe(returnValue);
   }

   @Test()
   public originalFunctionNotCalledIfSpyNotFaked() {
      let object = {
         originalFunction: () => {}
      };

      SpyOn(object, "originalFunction");

      let originalFunction = object.originalFunction;

      let spy = new RestorableFunctionSpy(object, "originalFunction");

      spy.call([]);

      Expect(originalFunction).toHaveBeenCalled();
   }

   @TestCase(() => {})
   @TestCase(() => 1 + 1)
   public fakeFunctionNotCalledIfSpyNotFaked(fakeFunction: Function) {
      let object = {
         originalFunction: () => {}
      };

      let fake = {
         function: fakeFunction
      };

      SpyOn(fake, "function");

      let originalFunction = object.originalFunction;

      let spy = new RestorableFunctionSpy(object, "originalFunction");

      spy.call([]);

      Expect(fake.function).not.toHaveBeenCalled();
   }
}
