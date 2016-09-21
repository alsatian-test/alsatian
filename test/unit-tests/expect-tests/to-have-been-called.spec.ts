import { FunctionCallMatchError } from "../../../core/errors/function-call-match-error";
import { Expect, Test, SpyOn, TestCase } from "../../../core/alsatian-core";

export class ToHaveBeenCalledTests {

   @Test()
   public functionCalledPasses() {
      let some = {
         function: () => {}
      };

      SpyOn(some, "function");

      some.function();

      Expect(() => Expect(some.function).toHaveBeenCalled()).not.toThrow();
   }

   @Test()
   public functionNotCalledFails() {
      let some = {
         function: () => {}
      };

      SpyOn(some, "function");

      Expect(() => Expect(some.function).toHaveBeenCalled()).toThrow();
   }

   @Test()
   public functionNotCalledFailsWithCorrectError() {
      let some = {
         function: () => {}
      };

      SpyOn(some, "function");

      Expect(() => Expect(some.function).toHaveBeenCalled()).toThrowError(FunctionCallMatchError, "Expected function to be called.");
   }

   @Test()
   public functionNotCalledPassesWhenShouldNotCall() {
      let some = {
         function: () => {}
      };

      SpyOn(some, "function");

      Expect(() => Expect(some.function).not.toHaveBeenCalled()).not.toThrow();
   }

   @Test()
   public functionThrowsErrorFailsWhenShouldNotThrow() {
      let some = {
         function: () => {}
      };

      SpyOn(some, "function");

      some.function();

      Expect(() => Expect(some.function).not.toHaveBeenCalled()).toThrow();
   }

   @Test()
   public functionThrowsErrorFailsWithCorrectError() {
      let some = {
         function: () => {}
      };

      SpyOn(some, "function");

      some.function();

      Expect(() => Expect(some.function).not.toHaveBeenCalled()).toThrowError(FunctionCallMatchError, "Expected function not to be called.");
   }

   @TestCase(undefined)
   @TestCase(null)
   @TestCase(0)
   @TestCase(1)
   @TestCase(42)
   @TestCase({})
   @TestCase({ "an": "object"})
   @TestCase([])
   @TestCase([ "an", "array" ])
   @TestCase(() => {})
   @TestCase((thisCouldBe: any) => "function")
   public checkingWhetherNonFunctionSpyOrSpiedOnFunctionHasBeenCalledShouldThrow(actualValue: any) {
      Expect(() => Expect(actualValue).toHaveBeenCalled()).toThrowError(TypeError, "toHaveBeenCalled requires value passed in to Expect to be a FunctionSpy or a spied on function.");
   }

   @TestCase(undefined)
   @TestCase(null)
   @TestCase(0)
   @TestCase(1)
   @TestCase(42)
   @TestCase({})
   @TestCase({ "an": "object"})
   @TestCase([])
   @TestCase([ "an", "array" ])
   @TestCase(() => {})
   @TestCase((thisCouldBe: any) => "function")
   public checkingWhetherNonFunctionSpyOrSpiedOnFunctionHasNotBeenCalledShouldThrow(actualValue: any) {
      Expect(() => Expect(actualValue).not.toHaveBeenCalled()).toThrowError(TypeError, "toHaveBeenCalled requires value passed in to Expect to be a FunctionSpy or a spied on function.");
   }
}
