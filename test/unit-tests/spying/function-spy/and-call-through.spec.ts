import { FunctionSpy } from "../../../../core/spying/function-spy";
import { Expect, Test, TestCase, SpyOn, FocusTest } from "../../../../core/alsatian-core";

export class AndCallThroughTests {

   @Test()
   public originalFunctionNotCalledIfSpyStub() {
      let object = {
         originalFunction: () => {}
      };

      SpyOn(object, "originalFunction");

      let originalFunction = object.originalFunction;

      let spy = new FunctionSpy(object, "originalFunction");

      spy.andStub();

      spy.call([]);

      Expect(originalFunction).not.toHaveBeenCalled();
   }

   @Test()
   public originalFunctionCalledIfSpyStubbedThenRestored() {
      let object = {
         originalFunction: () => {}
      };

      SpyOn(object, "originalFunction");

      let originalFunction = object.originalFunction;

      let spy = new FunctionSpy(object, "originalFunction");

      spy.andStub();
      spy.andCallThrough();

      spy.call([]);

      Expect(originalFunction).toHaveBeenCalled();
   }
}
