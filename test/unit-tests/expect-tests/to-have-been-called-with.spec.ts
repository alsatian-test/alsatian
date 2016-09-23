import { FunctionCallMatchError } from "../../../core/errors/function-call-match-error";
import { Expect, Test, TestCase, SpyOn } from "../../../core/alsatian-core";

export class ToHaveBeenCalledWithTests {

   @Test()
   public functionCalledPasses() {
      let some = {
         function: () => {}
      };

      SpyOn(some, "function");

      some.function();

      Expect(() => Expect(some.function).toHaveBeenCalledWith()).not.toThrow();
   }

   @Test()
   public functionNotCalledFails() {
      let some = {
         function: () => {}
      };

      SpyOn(some, "function");

      Expect(() => Expect(some.function).toHaveBeenCalledWith()).toThrow();
   }

   @Test()
   public functionNotCalledFailsWithCorrectError() {
      let some = {
         function: () => {}
      };

      SpyOn(some, "function");

      Expect(() => Expect(some.function).toHaveBeenCalledWith()).toThrowError(FunctionCallMatchError, "Expected function to be called with [].");
   }

   @TestCase([1])
   @TestCase(["argument"])
   @TestCase([1, "argument"])
   @TestCase(["argument", 1])
   public functionCalledWithCorrectArgumentsPasses(expectedArguments: Array<any>) {
      let some = {
         function: () => {}
      };

      SpyOn(some, "function");

      some.function.apply(some, expectedArguments);

      Expect(() => {
         let matcher = Expect(some.function);
         matcher.toHaveBeenCalledWith.apply(matcher, expectedArguments);
      }).not.toThrow();
   }

   @TestCase(["1"], [1])
   @TestCase([1], ["1"])
   @TestCase(["42"], [42])
   @TestCase([42], ["42"])
   @TestCase([1, "42"], [1, 42])
   @TestCase([1, 42], [1, "42"])
   @TestCase([1, "42"], ["1", 42])
   @TestCase(["1", 42], [1, "42"])
   @TestCase(["1", "42"], [1, 42])
   @TestCase([1, 42], ["1", "42"])
   public functionCalledWithSimilarArgumentsFailsWithCorrectError(expectedArguments: Array<any>, actualArguments: Array<any>) {
      let some = {
         function: () => {}
      };

      SpyOn(some, "function");

      some.function.apply(some, actualArguments);

      Expect(() => {
         let matcher = Expect(some.function);
         matcher.toHaveBeenCalledWith.apply(matcher, expectedArguments);
      }).toThrowError(FunctionCallMatchError, "Expected function to be called with [" + expectedArguments.map(arg => JSON.stringify(arg)).join(", ") + "].");
   }

   @TestCase([], [1])
   @TestCase([1], [])
   @TestCase([], ["argument"])
   @TestCase(["argument"], [])
   @TestCase([1], [1, 42])
   @TestCase([42], [1, 42])
   @TestCase([], [1, 42])
   @TestCase([42, 1], [])
   public functionCalledWithWrongNumberOfArgumentsFailsWithCorrectError(expectedArguments: Array<any>, actualArguments: Array<any>) {
      let some = {
         function: () => {}
      };

      SpyOn(some, "function");

      some.function.apply(some, actualArguments);

      Expect(() => {
         let matcher = Expect(some.function);
         matcher.toHaveBeenCalledWith.apply(matcher, expectedArguments);
      }).toThrowError(FunctionCallMatchError, "Expected function to be called with [" + expectedArguments.map(arg => JSON.stringify(arg)).join(", ") + "].");
   }

   @TestCase(["argument", 1], [1, "argument"])
   @TestCase([1, "argument"], ["argument", 1])
   public functionCalledWithRightArgumentsInWrongOrderFailsWithCorrectError(expectedArguments: Array<any>, actualArguments: Array<any>) {
      let some = {
         function: () => {}
      };

      SpyOn(some, "function");

      some.function.apply(some, actualArguments);

      Expect(() => {
         let matcher = Expect(some.function);
         matcher.toHaveBeenCalledWith.apply(matcher, expectedArguments);
      }).toThrowError(FunctionCallMatchError, "Expected function to be called with [" + expectedArguments.map(arg => JSON.stringify(arg)).join(", ") + "].");
   }

   @Test()
   public functionNotCalledPassesWhenShouldNotCall() {
      let some = {
         function: () => {}
      };

      SpyOn(some, "function");

      Expect(() => Expect(some.function).not.toHaveBeenCalledWith()).not.toThrow();
   }

   @Test()
   public functionThrowsErrorFailsWhenShouldNotThrow() {
      let some = {
         function: () => {}
      };

      SpyOn(some, "function");

      some.function();

      Expect(() => Expect(some.function).not.toHaveBeenCalledWith()).toThrow();
   }

   @Test()
   public functionThrowsErrorFailsWithCorrectError() {
      let some = {
         function: () => {}
      };

      SpyOn(some, "function");

      some.function();

      Expect(() => Expect(some.function).not.toHaveBeenCalledWith()).toThrowError(FunctionCallMatchError, "Expected function not to be called with [].");
   }

   @TestCase(["1"], [1])
   @TestCase([1], ["1"])
   @TestCase(["42"], [42])
   @TestCase([42], ["42"])
   @TestCase([1, "42"], [1, 42])
   @TestCase([1, 42], [1, "42"])
   @TestCase([1, "42"], ["1", 42])
   @TestCase(["1", 42], [1, "42"])
   @TestCase(["1", "42"], [1, 42])
   @TestCase([1, 42], ["1", "42"])
   public functionCalledWithSimilarArgumentsPasses(expectedArguments: Array<any>, actualArguments: Array<any>) {
      let some = {
         function: () => {}
      };

      SpyOn(some, "function");

      some.function.apply(some, actualArguments);

      Expect(() => {
         let matcher = Expect(some.function);
         matcher.not.toHaveBeenCalledWith.apply(matcher, expectedArguments);
      }).not.toThrow();
   }

   @TestCase([], [1])
   @TestCase([1], [])
   @TestCase([], ["argument"])
   @TestCase(["argument"], [])
   @TestCase([1], [1, 42])
   @TestCase([42], [1, 42])
   @TestCase([], [1, 42])
   @TestCase([42, 1], [])
   public functionCalledWithWrongNumberOfArgumentsPasses(expectedArguments: Array<any>, actualArguments: Array<any>) {
      let some = {
         function: () => {}
      };

      SpyOn(some, "function");

      some.function.apply(some, actualArguments);

      Expect(() => {
         let matcher = Expect(some.function);
         matcher.not.toHaveBeenCalledWith.apply(matcher, expectedArguments);
      }).not.toThrow();
   }

   @TestCase(["argument", 1], [1, "argument"])
   @TestCase([1, "argument"], ["argument", 1])
   public functionNotCalledWithRightArgumentsInWrongOrderPasses(expectedArguments: Array<any>, actualArguments: Array<any>) {
      let some = {
         function: () => {}
      };

      SpyOn(some, "function");

      some.function.apply(some, actualArguments);

      Expect(() => {
         let matcher = Expect(some.function);
         matcher.not.toHaveBeenCalledWith.apply(matcher, expectedArguments);
      }).not.toThrow();
   }

   @TestCase([1])
   @TestCase(["argument"])
   @TestCase([1, "argument"])
   @TestCase(["argument", 1])
   public functionNotCalledWithDifferentArgumentsFailsWithCorrectError(expectedArguments: Array<any>) {
      let some = {
         function: () => {}
      };

      SpyOn(some, "function");

      some.function.apply(some, expectedArguments);

      Expect(() => {
         let matcher = Expect(some.function);
         matcher.not.toHaveBeenCalledWith.apply(matcher, expectedArguments);
      }).toThrowError(FunctionCallMatchError, "Expected function not to be called with [" + expectedArguments.map(arg => JSON.stringify(arg)).join(", ") + "].");
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
      Expect(() => Expect(actualValue).toHaveBeenCalledWith()).toThrowError(TypeError, "toHaveBeenCalledWith requires value passed in to Expect to be a FunctionSpy or a spied on function.");
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
      Expect(() => Expect(actualValue).not.toHaveBeenCalledWith()).toThrowError(TypeError, "toHaveBeenCalledWith requires value passed in to Expect to be a FunctionSpy or a spied on function.");
   }

   @TestCase([[]])
   @TestCase([[], []])
   @TestCase([[1], [2], [3]])
   @TestCase([["something", "and", "another", "thing"]])
   @TestCase([["this", "or"], ["that", "other", "thing"]])
   public actualValueAndShouldMatchShouldBeSetToFunctionWasNotCalledWithArguments(actualArgumentsList: Array<Array<any>>) {
      let some = {
         function: (args: Array<any>) => {}
      };

      SpyOn(some, "function");

      actualArgumentsList.forEach(actualArguments => {
         some.function.apply(some, actualArguments);
      });

      let functionError: FunctionCallMatchError;

      try {
         Expect(some.function).toHaveBeenCalledWith([]);
      }
      catch (error) {
         functionError = error;
      }

      Expect(functionError).toBeDefined();
      Expect(functionError).not.toBeNull();
      Expect(functionError.actualValue).toBe("function was called with " + actualArgumentsList.map(args => JSON.stringify(args)).join(", ") + ".");
   }

   @TestCase([[]])
   @TestCase([[], []])
   @TestCase([[1], [2], [3]])
   @TestCase([["something", "and", "another", "thing"]])
   @TestCase([["this", "or"], ["that", "other", "thing"]])
   public actualValueAndShouldNotMatchShouldBeSetToFunctionWasCalledWithArguments(actualArgumentsList: Array<Array<any>>) {
      let some = {
         function: (args: Array<any>) => {}
      };

      SpyOn(some, "function");

      actualArgumentsList.forEach(actualArguments => {
         some.function.apply(some, actualArguments);
      });

      let functionError: FunctionCallMatchError;

      try {
         const expect = Expect(some.function);

         expect.not.toHaveBeenCalledWith.apply(expect, actualArgumentsList[0]);
      }
      catch (error) {
         functionError = error;
      }

      Expect(functionError).toBeDefined();
      Expect(functionError).not.toBeNull();
      Expect(functionError.actualValue).toBe("function was called with " + actualArgumentsList.map(args => JSON.stringify(args)).join(", ") + ".");
   }

   @TestCase([])
   @TestCase([1])
   @TestCase(["something"])
   @TestCase([1, "or", 2, "other", "things"])
   public expectedValueAndShouldMatchShouldBeSetToFunctionToBeCalledWithArguments(expectedArguments: Array<any>) {
      let some = {
         function: (args: Array<any>) => {}
      };

      SpyOn(some, "function");

      let functionError: FunctionCallMatchError;

      try {
         const expect = Expect(some.function);

         expect.toHaveBeenCalledWith.apply(expect, expectedArguments);
      }
      catch (error) {
         functionError = error;
      }

      Expect(functionError).toBeDefined();
      Expect(functionError).not.toBeNull();
      Expect(functionError.expectedValue).toBe("function to be called with " + JSON.stringify(expectedArguments) + ".");
   }

   @TestCase([])
   @TestCase([1])
   @TestCase(["something"])
   @TestCase([1, "or", 2, "other", "things"])
   public expectedValueAndShouldNotMatchShouldBeSetToFunctionNotToBeCalledWithArguments(expectedArguments: Array<any>) {
      let some = {
         function: (args: Array<any>) => {}
      };

      SpyOn(some, "function");

      some.function.apply(some, expectedArguments);

      let functionError: FunctionCallMatchError;

      try {
         const expect = Expect(some.function);

         expect.not.toHaveBeenCalledWith.apply(expect, expectedArguments);
      }
      catch (error) {
         functionError = error;
      }

      Expect(functionError).toBeDefined();
      Expect(functionError).not.toBeNull();
      Expect(functionError.expectedValue).toBe("function not to be called with " + JSON.stringify(expectedArguments) + ".");
   }
}
