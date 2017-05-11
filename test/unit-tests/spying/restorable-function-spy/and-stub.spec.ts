import { Expect, SpyOn, Test, TestCase } from "../../../../core/alsatian-core";
import { RestorableFunctionSpy } from "../../../../core/spying/restorable-function-spy";

export class AndStubTests {

   @Test()
   public originalFunctionNotCalledIfSpyStub() {
      const object = {
         originalFunction: () => {}
      };

      SpyOn(object, "originalFunction");

      const originalFunction = object.originalFunction;

      const spy = new RestorableFunctionSpy(object, "originalFunction");

      spy.andStub();

      spy.call([]);

      Expect(originalFunction).not.toHaveBeenCalled();
   }

   @Test()
   public originalFunctionNotCalledIfSpyNotStubbed() {
      const object = {
         originalFunction: () => {}
      };

      SpyOn(object, "originalFunction");

      const originalFunction = object.originalFunction;

      const spy = new RestorableFunctionSpy(object, "originalFunction");

      spy.call([]);

      Expect(originalFunction).toHaveBeenCalled();
   }
}
