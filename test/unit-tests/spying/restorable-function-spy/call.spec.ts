import { Expect, SpyOn, Test, TestCase } from "../../../../core/alsatian-core";
import { RestorableFunctionSpy } from "../../../../core/spying/restorable-function-spy";

export class CallTests {

   @TestCase([])
   @TestCase([ 1 ])
   @TestCase([ 1, 2 ])
   @TestCase([ "one", 2 ])
   @TestCase([ { some: "thing" }, [] ])
   public argumentsRecorded(args: Array<any>) {
      let object = {
         originalFunction: () => undefined
      };

      let spy = new RestorableFunctionSpy(object, "originalFunction");

      spy.call.apply(spy, args);

      Expect(spy.calls[0].args).toEqual(args);
   }

   @TestCase(0)
   @TestCase(1)
   @TestCase(42)
   public callAddedForEachCall(callCount: number) {
      let object = {
         originalFunction: () => undefined
      };

      let spy = new RestorableFunctionSpy(object, "originalFunction");

      for (let i = 0; i < callCount; i++) {
         spy.call.apply(spy, []);
      }

      Expect(spy.calls.length).toBe(callCount);
   }

   @Test()
   public originalFunctionIsCalled() {
      let object = {
         originalFunction: () => undefined
      };

      SpyOn(object, "originalFunction");

      let originalFunction = object.originalFunction;

      let spy = new RestorableFunctionSpy(object, "originalFunction");

      spy.call.apply(spy, []);

      Expect(originalFunction).toHaveBeenCalled();
   }

   @Test()
   public originalFunctionNotCalledIfSpyStub() {
      let object = {
         originalFunction: () => undefined
      };

      SpyOn(object, "originalFunction");

      let originalFunction = object.originalFunction;

      let spy = new RestorableFunctionSpy(object, "originalFunction");

      spy.andStub();

      spy.call.apply(spy, []);

      Expect(originalFunction).not.toHaveBeenCalled();
   }

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

      let actualReturnValue = spy.call.apply(spy, []);

      Expect(actualReturnValue).toBe(expectedReturnValue);
   }
}
