import { Expect, FunctionSpy, SpyOn, Test, TestCase } from "../../../core/alsatian-core";
import { createFunctionSpy } from "../../../core/spying/create-function-spy";

export class CallTests {

   @TestCase([])
   @TestCase([ 1 ])
   @TestCase([ 1, 2 ])
   @TestCase([ "one", 2 ])
   @TestCase([ { some: "thing" }, [] ])
   public argumentsRecorded(args: Array<any>) {
      const object = {
         originalFunction: () => {}
      };

      const spy = createFunctionSpy();

      spy.apply(this, args);

      Expect(spy.calls[0].args).toEqual(args);
   }

   @TestCase(0)
   @TestCase(1)
   @TestCase(42)
   public callAddedForEachCall(callCount: number) {
      const object = {
         originalFunction: () => {}
      };

      const spy = createFunctionSpy();

      for (let i = 0; i < callCount; i++) {
         spy();
      }

      Expect(spy.calls.length).toBe(callCount);
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
      const object = {
         originalFunction: () => {}
      };

      SpyOn(object, "originalFunction");

      const originalFunction = object.originalFunction;

      const spy = createFunctionSpy();

      spy.andReturn(expectedReturnValue);

      const actualReturnValue = spy();

      Expect(actualReturnValue).toBe(expectedReturnValue);
   }
}
