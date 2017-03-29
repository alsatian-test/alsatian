import { Expect, SpyOn, TestCase } from "../../../core/alsatian-core";
import { FunctionCallCountMatchError } from "../../../core/errors";
import { FunctionSpyMatcher } from "../../../core/matchers";
import { FunctionSpy } from "../../../core/spying";

export class FunctionSpyMatcherTests {

   @TestCase(null)
   @TestCase(undefined)
   public nullOrUndefinedSpyThrowsError(spy: FunctionSpy) {
      Expect(() => new FunctionSpyMatcher(spy)).toThrowError(TypeError, "spy must not be null or undefined.");
   }

   @TestCase(0)
   @TestCase(-1)
   @TestCase(-2)
   @TestCase(-42)
   public negativeOrZeroExactlyValueThrowsError(expectedCallCount: number) {
      const some = {
         function: () => {}
      };

      SpyOn(some, "function");

      const spyMatcher = new FunctionSpyMatcher(some.function as any);

      Expect(() => spyMatcher.exactly(expectedCallCount).times)
        .toThrowError(TypeError, "expectedCallCount must be greater than 0.");
   }

   @TestCase(1)
   @TestCase(2)
   @TestCase(42)
   public exactlyMatchesDoesNotThrow(callCount: number) {
      const some = {
         function: () => {}
      };

      SpyOn(some, "function");

      for (let i = 0; i < callCount; i++) {
         some.function();
      }

      const spyMatcher = new FunctionSpyMatcher(some.function as any);

      Expect(() => spyMatcher.exactly(callCount).times).not.toThrow();
   }

   @TestCase(1, 42)
   @TestCase(2, 1)
   @TestCase(42, 2)
   public exactlyDoesntMatchThrowsError(expectedCallCount: number, actualCallCount: number) {
      const some = {
         function: () => {}
      };

      SpyOn(some, "function");

      for (let i = 0; i < actualCallCount; i++) {
         some.function();
      }

      const spyMatcher = new FunctionSpyMatcher(some.function as any);

      if (expectedCallCount === 1) {
         Expect(() => spyMatcher.exactly(expectedCallCount).times)
            .toThrowError(FunctionCallCountMatchError, `Expected function to be called 1 time.`);
      }
      else {
         Expect(() => spyMatcher.exactly(expectedCallCount).times)
            .toThrowError(FunctionCallCountMatchError, `Expected function to be called ${expectedCallCount} times.`);
      }
   }

   @TestCase(0)
   @TestCase(-1)
   @TestCase(-2)
   @TestCase(-42)
   public negativeOrZeroAnythingButValueThrowsError(expectedCallCount: number) {
      const some = {
         function: () => {}
      };

      SpyOn(some, "function");

      const spyMatcher = new FunctionSpyMatcher(some.function as any);

      Expect(() => spyMatcher.anythingBut(expectedCallCount).times)
        .toThrowError(TypeError, "unexpectedCallCount must be greater than 0.");
   }

   @TestCase(1, 42)
   @TestCase(2, 1)
   @TestCase(42, 2)
   public anythingButMatchesDoesNotThrow(unexpectedCallCount: number, actualCallCount: number) {
      const some = {
         function: () => {}
      };

      SpyOn(some, "function");

      for (let i = 0; i < actualCallCount; i++) {
         some.function();
      }

      const spyMatcher = new FunctionSpyMatcher(some.function as any);

      Expect(() => spyMatcher.anythingBut(unexpectedCallCount).times).not.toThrow();
   }

   @TestCase(1)
   @TestCase(2)
   @TestCase(42)
   public anythingButDoesntMatchThrowsError(unexpectedCallCount: number) {
      const some = {
         function: () => {}
      };

      SpyOn(some, "function");

      for (let i = 0; i < unexpectedCallCount; i++) {
         some.function();
      }

      const spyMatcher = new FunctionSpyMatcher(some.function as any);

      if (unexpectedCallCount === 1) {
         Expect(() => spyMatcher.anythingBut(unexpectedCallCount).times)
            .toThrowError(FunctionCallCountMatchError, `Expected function not to be called 1 time.`);
      }
      else {
         Expect(() => spyMatcher.anythingBut(unexpectedCallCount).times)
            .toThrowError(FunctionCallCountMatchError,
                         `Expected function not to be called ${unexpectedCallCount} times.`);
      }
   }

   @TestCase(0)
   @TestCase(-1)
   @TestCase(-2)
   @TestCase(-42)
   public negativeOrZeroLessThanValueThrowsError(expectedCallCount: number) {
      const some = {
         function: () => {}
      };

      SpyOn(some, "function");

      const spyMatcher = new FunctionSpyMatcher(some.function as any);

      Expect(() => spyMatcher.lessThan(expectedCallCount).times)
        .toThrowError(TypeError, "maximumCallCount must be greater than 0.");
   }

   @TestCase(1, 0)
   @TestCase(2, 1)
   @TestCase(42, 36)
   public lessThanMatchesDoesNotThrow(maximumCallCount: number, actualCallCount: number) {
      const some = {
         function: () => {}
      };

      SpyOn(some, "function");

      for (let i = 0; i < actualCallCount; i++) {
         some.function();
      }

      const spyMatcher = new FunctionSpyMatcher(some.function as any);

      Expect(() => spyMatcher.lessThan(maximumCallCount).times).not.toThrow();
   }

   @TestCase(1, 1)
   @TestCase(2, 3)
   @TestCase(42, 56)
   public lessThanDoesntMatchThrowsError(maximumCallCount: number, actualCallCount: number) {
      const some = {
         function: () => {}
      };

      SpyOn(some, "function");

      for (let i = 0; i < actualCallCount; i++) {
         some.function();
      }

      const spyMatcher = new FunctionSpyMatcher(some.function as any);

      if (maximumCallCount === 1) {
         Expect(() => spyMatcher.lessThan(maximumCallCount).times)
            .toThrowError(FunctionCallCountMatchError, `Expected function to be called less than 1 time.`);
      }
      else {
         Expect(() => spyMatcher.lessThan(maximumCallCount).times)
            .toThrowError(FunctionCallCountMatchError,
                         `Expected function to be called less than ${maximumCallCount} times.`);
      }
   }

   @TestCase(0)
   @TestCase(-1)
   @TestCase(-2)
   @TestCase(-42)
   public negativeOrZeroGreaterThanValueThrowsError(expectedCallCount: number) {
      const some = {
         function: () => {}
      };

      SpyOn(some, "function");

      const spyMatcher = new FunctionSpyMatcher(some.function as any);

      Expect(() => spyMatcher.greaterThan(expectedCallCount).times)
        .toThrowError(TypeError, "minimumCallCount must be greater than 0.");
   }

   @TestCase(1, 2)
   @TestCase(2, 3)
   @TestCase(42, 56)
   public greaterThanMatchesDoesNotThrow(maximumCallCount: number, actualCallCount: number) {
      const some = {
         function: () => {}
      };

      SpyOn(some, "function");

      for (let i = 0; i < actualCallCount; i++) {
         some.function();
      }

      const spyMatcher = new FunctionSpyMatcher(some.function as any);

      Expect(() => spyMatcher.greaterThan(maximumCallCount).times).not.toThrow();
   }

   @TestCase(1, 0)
   @TestCase(2, 1)
   @TestCase(42, 36)
   public greaterThanDoesntMatchThrowsError(maximumCallCount: number, actualCallCount: number) {
      const some = {
         function: () => {}
      };

      SpyOn(some, "function");

      for (let i = 0; i < actualCallCount; i++) {
         some.function();
      }

      const spyMatcher = new FunctionSpyMatcher(some.function as any);

      if (maximumCallCount === 1) {
         Expect(() => spyMatcher.greaterThan(maximumCallCount).times)
            .toThrowError(FunctionCallCountMatchError, `Expected function to be called greater than 1 time.`);
      }
      else {
         Expect(() => spyMatcher.greaterThan(maximumCallCount).times)
            .toThrowError(FunctionCallCountMatchError,
                         `Expected function to be called greater than ${maximumCallCount} times.`);
      }
   }
}
