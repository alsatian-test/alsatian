import { Expect, SpyOn, Test, TestCase } from "../../../../core/alsatian-core";
import { RestorableFunctionSpy } from "../../../../core/spying/restorable-function-spy";

export class AndCallThroughTests {

   @Test()
   public originalFunctionNotCalledIfSpyStub() {
      let object = {
         originalFunction: () => undefined
      };

      SpyOn(object, "originalFunction");

      let originalFunction = object.originalFunction;

      let spy = new RestorableFunctionSpy(object, "originalFunction");

      spy.andStub();

      spy.call([]);

      Expect(originalFunction).not.toHaveBeenCalled();
   }

   @Test()
   public originalFunctionCalledIfSpyStubbedThenRestored() {
      let object = {
         originalFunction: () => undefined
      };

      SpyOn(object, "originalFunction");

      let originalFunction = object.originalFunction;

      let spy = new RestorableFunctionSpy(object, "originalFunction");

      spy.andStub();
      spy.andCallThrough();

      spy.call([]);

      Expect(originalFunction).toHaveBeenCalled();
   }
}
