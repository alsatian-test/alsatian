import { FunctionCallMatchError, FunctionCallCountMatchError } from "../../../core/_errors";
import { Expect, Test, SpyOn, TestCase, FunctionSpy, FocusTests } from "../../../core/alsatian-core";

@FocusTests
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

   @Test()
   public actualValueAndShouldMatchShouldBeSetToFunctionWasNotCalled() {
      let some = {
         function: () => {}
      };

      SpyOn(some, "function");

      let functionError: FunctionCallMatchError;

      try {
         Expect(some.function).toHaveBeenCalled();
      }
      catch (error) {
         functionError = error;
      }

      Expect(functionError).toBeDefined();
      Expect(functionError).not.toBeNull();
      Expect(functionError.actualValue).toBe("function was not called.");
   }

   @Test()
   public actualValueAndShouldNotMatchShouldBeSetToFunctionWasCalled() {
      let some = {
         function: () => {}
      };

      SpyOn(some, "function");

      some.function();

      let functionError: FunctionCallMatchError;

      try {
         Expect(some.function).not.toHaveBeenCalled();
      }
      catch (error) {
         functionError = error;
      }

      Expect(functionError).toBeDefined();
      Expect(functionError).not.toBeNull();
      Expect(functionError.actualValue).toBe("function was called.");
   }

   @Test()
   public expectedValueAndShouldMatchShouldBeSetToFunctionToBeCalled() {
      let some = {
         function: () => {}
      };

      SpyOn(some, "function");

      let functionError: FunctionCallMatchError;

      try {
         Expect(some.function).toHaveBeenCalled();
      }
      catch (error) {
         functionError = error;
      }

      Expect(functionError).toBeDefined();
      Expect(functionError).not.toBeNull();
      Expect(functionError.expectedValue).toBe("function to be called.");
   }

   @Test()
   public expectedValueAndShouldNotMatchShouldBeSetToFunctionNotToBeCalled() {
      let some = {
         function: () => {}
      };

      SpyOn(some, "function");

      some.function();

      let functionError: FunctionCallMatchError;

      try {
         Expect(some.function).not.toHaveBeenCalled();
      }
      catch (error) {
         functionError = error;
      }

      Expect(functionError).toBeDefined();
      Expect(functionError).not.toBeNull();
      Expect(functionError.expectedValue).toBe("function not to be called.");
   }

   @TestCase(1)
   @TestCase(2)
   @TestCase(42)
   public spyCalledCorrectAmountOfTimesDoesNotThrow(callCount: number) {
      let some = {
         function: () => {}
      };

      SpyOn(some, "function");

      for (let i = 0 ; i < callCount; i++) {
         some.function();
      }

      Expect(() => Expect(some.function).toHaveBeenCalled().exactly(callCount).times).not.toThrow();
   }

   @TestCase(1, 2)
   @TestCase(2, 42)
   @TestCase(42, 1)
   public spyCalledCorrectAmountOfTimesThrowsCorrectError(expectedCallCount: number, actualCallCount: number) {
      let some = {
         function: () => {}
      };

      SpyOn(some, "function");

      for (let i = 0 ; i < actualCallCount; i++) {
         some.function();
      }

      if (expectedCallCount === 1) {
         Expect(
            () => Expect(some.function).toHaveBeenCalled().exactly(expectedCallCount).times
         ).toThrowError(FunctionCallCountMatchError, "Expected function to be called " + expectedCallCount + " time.");
      }
      else {
         Expect(
            () => Expect(some.function).toHaveBeenCalled().exactly(expectedCallCount).times
         ).toThrowError(FunctionCallCountMatchError, "Expected function to be called " + expectedCallCount + " times.");
      }
   }

   @TestCase(1, 2)
   @TestCase(2, 42)
   @TestCase(42, 1)
   public spyCalledCorrectAmountOfTimesThrowsCorrectErrorExpectedValue(expectedCallCount: number, actualCallCount: number) {
      let some = {
         function: () => {}
      };

      SpyOn(some, "function");

      for (let i = 0 ; i < actualCallCount; i++) {
         some.function();
      }

      let functionError: FunctionCallCountMatchError;

      try {
         Expect(some.function).toHaveBeenCalled().exactly(expectedCallCount).times;
      }
      catch (error) {
         functionError = error;
      }

      Expect(functionError).toBeDefined();
      Expect(functionError).not.toBeNull();

      if (expectedCallCount === 1) {
         Expect(functionError.expectedValue).toBe("function to be called " + expectedCallCount + " time.");
      }
      else {
         Expect(functionError.expectedValue).toBe("function to be called " + expectedCallCount + " times.");
      }
   }

   @TestCase(1, 2)
   @TestCase(2, 42)
   @TestCase(42, 1)
   public spyCalledCorrectAmountOfTimesThrowsCorrectErrorActualValue(expectedCallCount: number, actualCallCount: number) {
      let some = {
         function: () => {}
      };

      SpyOn(some, "function");

      for (let i = 0 ; i < actualCallCount; i++) {
         some.function();
      }

      let functionError: FunctionCallCountMatchError;

      try {
         Expect(some.function).toHaveBeenCalled().exactly(expectedCallCount).times;
      }
      catch (error) {
         functionError = error;
      }

      Expect(functionError).toBeDefined();
      Expect(functionError).not.toBeNull();

      if (actualCallCount === 1) {
         Expect(functionError.actualValue).toBe("function was called " + actualCallCount + " time.");
      }
      else {
         Expect(functionError.actualValue).toBe("function was called " + actualCallCount + " times.");
      }
   }

   @TestCase(1, 2)
   @TestCase(2, 42)
   @TestCase(42, 1)
   public spyNotCalledCorrectAmountOfTimesDoesNotThrow(expectedCallCount: number, actualCallCount: number) {
      let some = {
         function: () => {}
      };

      SpyOn(some, "function");

      for (let i = 0 ; i < actualCallCount; i++) {
         some.function();
      }

      Expect(() => Expect(some.function).toHaveBeenCalled().anythingBut(expectedCallCount).times).not.toThrow();
   }

   @TestCase(1)
   @TestCase(2)
   @TestCase(42)
   public spyCalledCorrectAmountOfTimesButShouldNotThrowsCorrectError(callCount: number) {
      let some = {
         function: () => {}
      };

      SpyOn(some, "function");

      for (let i = 0 ; i < callCount; i++) {
         some.function();
      }

      if (callCount === 1) {
         Expect(
            () => Expect(some.function).toHaveBeenCalled().anythingBut(callCount).times
         ).toThrowError(FunctionCallCountMatchError, "Expected function not to be called " + callCount + " time.");
      }
      else {
         Expect(
            () => Expect(some.function).toHaveBeenCalled().anythingBut(callCount).times
         ).toThrowError(FunctionCallCountMatchError, "Expected function not to be called " + callCount + " times.");
      }
   }

   @TestCase(1)
   @TestCase(2)
   @TestCase(42)
   public spyCalledCorrectAmountOfTimesButShouldNotThrowsCorrectErrorExpectedValue(callCount: number) {
      let some = {
         function: () => {}
      };

      SpyOn(some, "function");

      for (let i = 0 ; i < callCount; i++) {
         some.function();
      }

      let functionError: FunctionCallCountMatchError;

      try {
         Expect(some.function).toHaveBeenCalled().anythingBut(callCount).times;
      }
      catch (error) {
         functionError = error;
      }

      Expect(functionError).toBeDefined();
      Expect(functionError).not.toBeNull();

      if (callCount === 1) {
         Expect(functionError.expectedValue).toBe("function not to be called " + callCount + " time.");
      }
      else {
         Expect(functionError.expectedValue).toBe("function not to be called " + callCount + " times.");
      }
   }

   @TestCase(1)
   @TestCase(2)
   @TestCase(42)
   public spyCalledCorrectAmountOfTimesButShouldNotThrowsCorrectErrorActualValue(callCount: number) {
      let some = {
         function: () => {}
      };

      SpyOn(some, "function");

      for (let i = 0 ; i < callCount; i++) {
         some.function();
      }

      let functionError: FunctionCallCountMatchError;

      try {
         Expect(some.function).toHaveBeenCalled().anythingBut(callCount).times;
      }
      catch (error) {
         functionError = error;
      }

      Expect(functionError).toBeDefined();
      Expect(functionError).not.toBeNull();

      if (callCount === 1) {
         Expect(functionError.actualValue).toBe("function was called " + callCount + " time.");
      }
      else {
         Expect(functionError.actualValue).toBe("function was called " + callCount + " times.");
      }
   }

   //TODO: greater than matches
   //TODO: greater than doesn't match

   //TODO: less than matches
   //TODO: less than doesn't match
}
