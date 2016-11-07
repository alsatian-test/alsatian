import { FunctionCallMatchError, FunctionCallCountMatchError } from "../../../core/_errors";
import { Expect, Test, TestCase, SpyOn, Any, FocusTests, FocusTest } from "../../../core/alsatian-core";

@FocusTests
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
      Expect(functionError.expectedValue).toBe("function to be called with " + JSON.stringify(expectedArguments).replace(/,/g, ", ") + ".");
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
      Expect(functionError.expectedValue).toBe("function not to be called with " + JSON.stringify(expectedArguments).replace(/,/g, ", ") + ".");
   }

   @TestCase(undefined)
   @TestCase(null)
   @TestCase(0)
   @TestCase(1)
   @TestCase(42)
   @TestCase(-42)
   @TestCase(new Number(0))
   @TestCase(new Number(1))
   @TestCase(new Number(42))
   @TestCase(new Number(-42))
   @TestCase("")
   @TestCase(new String(""))
   @TestCase("test")
   @TestCase(new String("test"))
   @TestCase(true)
   @TestCase(false)
   @TestCase(new Boolean(true))
   @TestCase(new Boolean(false))
   @TestCase({})
   @TestCase({ "an": "object"})
   @TestCase(new Object({}))
   @TestCase(new Object({ "an": "object"}))
   @TestCase([])
   @TestCase([ "an", "array" ])
   @TestCase(new Array([]))
   @TestCase(new Array([ "an", "array" ]))
   @TestCase(new Error())
   @TestCase(new Error("something went wrong"))
   public anyArgumentShouldNotThrowIfOneArgument(argument: any) {
      const some = {
         function: (...args: Array<any>) => {}
      };

      SpyOn(some, "function");

      some.function(argument);

      Expect(() => Expect(some.function).toHaveBeenCalledWith(Any)).not.toThrow();
   }

   @Test()
   public anyArgumentShouldNotThrowIfTwoArguments() {
      const some = {
         function: (...args: Array<any>) => {}
      };

      SpyOn(some, "function");

      some.function(1, "two");

      Expect(() => Expect(some.function).toHaveBeenCalledWith(Any, Any)).not.toThrow();
   }

   @Test()
   public anyArgumentShouldNotThrowIfThreeArguments() {
      const some = {
         function: (...args: Array<any>) => {}
      };

      SpyOn(some, "function");

      some.function(1, "two", undefined);

      Expect(() => Expect(some.function).toHaveBeenCalledWith(Any, Any, Any)).not.toThrow();
   }

   @TestCase()
   @TestCase(1, 2)
   @TestCase(42, undefined)
   @TestCase(1, 2, 3)
   @TestCase("some", "function", "arguments")
   public anyArgumentShouldThrowIfOneArgumentExpectedAndNotProvided(...args: Array<any>) {
      const some = {
         function: (...args: Array<any>) => {}
      };

      SpyOn(some, "function");

      some.function.apply(some, args);

      Expect(() => Expect(some.function).toHaveBeenCalledWith(Any)).toThrowError(FunctionCallMatchError, "Expected function to be called with [Anything].");
   }

   @TestCase()
   @TestCase(42)
   @TestCase("argument")
   @TestCase(1, 2, undefined)
   @TestCase("some", "function", "arguments")
   public anyArgumentShouldThrowIfTwoArgumentsExpectedAndNotProvided(...args: Array<any>) {
      const some = {
         function: (...args: Array<any>) => {}
      };

      SpyOn(some, "function");

      some.function.apply(some, args);

      Expect(() => Expect(some.function).toHaveBeenCalledWith(Any, Any)).toThrowError(FunctionCallMatchError, "Expected function to be called with [Anything, Anything].");
   }

   @TestCase()
   @TestCase(1, 2)
   @TestCase(42, undefined)
   @TestCase(1, 2, 3)
   @TestCase("some", "function", "arguments")
   public anyArgumentShouldThrowWithExpectedMessageIfOneArgumentExpectedAndNotProvided(...args: Array<any>) {
      const some = {
         function: (...args: Array<any>) => {}
      };

      SpyOn(some, "function");
      some.function.apply(some, args);

      let functionCallError: FunctionCallMatchError;

      try {
         Expect(some.function).toHaveBeenCalledWith(Any);
      }
      catch (error) {
         functionCallError = error;
      }

      Expect(functionCallError).toBeDefined();
      Expect(functionCallError).not.toBeNull();
      Expect(functionCallError.expectedValue).toBe("function to be called with [Anything].");
   }

   @TestCase()
   @TestCase(42)
   @TestCase("argument")
   @TestCase(1, 2, undefined)
   @TestCase("some", "function", "arguments")
   public anyArgumentShouldThrowWithexpectedMessageIfTwoArgumentsExpectedAndNotProvided(...args: Array<any>) {
      const some = {
         function: (...args: Array<any>) => {}
      };

      SpyOn(some, "function");
      some.function.apply(some, args);

      let functionCallError: FunctionCallMatchError;

      try {
         Expect(some.function).toHaveBeenCalledWith(Any, Any);
      }
      catch (error) {
         functionCallError = error;
      }

      Expect(functionCallError).toBeDefined();
      Expect(functionCallError).not.toBeNull();
      Expect(functionCallError.expectedValue).toBe("function to be called with [Anything, Anything].");
   }

   @TestCase(0)
   @TestCase(1)
   @TestCase(42)
   @TestCase(-42)
   @TestCase(new Number(0))
   @TestCase(new Number(1))
   @TestCase(new Number(42))
   @TestCase(new Number(-42))
   public anyNumberArgumentShouldNotThrowIfNumberArgument(argument: any) {
      const some = {
         function: (...args: Array<any>) => {}
      };

      SpyOn(some, "function");

      some.function(argument);

      Expect(() => Expect(some.function).toHaveBeenCalledWith(Any(Number))).not.toThrow();
   }

   @TestCase(0)
   @TestCase(1)
   @TestCase(42)
   @TestCase(-42)
   @TestCase(new Number(0))
   @TestCase(new Number(1))
   @TestCase(new Number(42))
   @TestCase(new Number(-42))
   public anyNumberArgumentShouldNotBeCalledShouldThrowIfNumberArgument(argument: any) {
      const some = {
         function: (...args: Array<any>) => {}
      };

      SpyOn(some, "function");

      some.function(argument);

      Expect(() => Expect(some.function).not.toHaveBeenCalledWith(Any(Number))).toThrowError(FunctionCallMatchError, "Expected function not to be called with [Any Number].");
   }

   @TestCase(undefined)
   @TestCase(null)
   @TestCase("")
   @TestCase(new String(""))
   @TestCase("test")
   @TestCase(new String("test"))
   @TestCase(true)
   @TestCase(false)
   @TestCase(new Boolean(true))
   @TestCase(new Boolean(false))
   @TestCase({})
   @TestCase({ "an": "object"})
   @TestCase(new Object({}))
   @TestCase(new Object({ "an": "object"}))
   @TestCase([])
   @TestCase([ "an", "array" ])
   @TestCase(new Array([]))
   @TestCase(new Array([ "an", "array" ]))
   @TestCase(new Error())
   @TestCase(new Error("something went wrong"))
   public anyNumberArgumentShouldThrowIfNonNumberArgument(argument: any) {
      const some = {
         function: (...args: Array<any>) => {}
      };

      SpyOn(some, "function");

      some.function(argument);

      Expect(() => Expect(some.function).toHaveBeenCalledWith(Any(Number))).toThrowError(FunctionCallMatchError, "Expected function to be called with [Any Number].");
   }

   @TestCase(undefined)
   @TestCase(null)
   @TestCase("")
   @TestCase(new String(""))
   @TestCase("test")
   @TestCase(new String("test"))
   @TestCase(true)
   @TestCase(false)
   @TestCase(new Boolean(true))
   @TestCase(new Boolean(false))
   @TestCase({})
   @TestCase({ "an": "object"})
   @TestCase(new Object({}))
   @TestCase(new Object({ "an": "object"}))
   @TestCase([])
   @TestCase([ "an", "array" ])
   @TestCase(new Array([]))
   @TestCase(new Array([ "an", "array" ]))
   @TestCase(new Error())
   @TestCase(new Error("something went wrong"))
   public anyNumberArgumentShouldThrowWithExpectedValueIfNonNumberArgument(argument: any) {
      const some = {
         function: (...args: Array<any>) => {}
      };

      SpyOn(some, "function");
      some.function(argument);

      let functionCallError: FunctionCallMatchError;

      try {
         Expect(some.function).toHaveBeenCalledWith(Any(Number));
      }
      catch (error) {
         functionCallError = error;
      }

      Expect(functionCallError).toBeDefined();
      Expect(functionCallError).not.toBeNull();
      Expect(functionCallError.expectedValue).toBe("function to be called with [Any Number].");
   }

   @TestCase("")
   @TestCase(new String(""))
   @TestCase("test")
   @TestCase(new String("test"))
   public anyStringArgumentShouldNotThrowIfStringArgument(argument: any) {
      const some = {
         function: (...args: Array<any>) => {}
      };

      SpyOn(some, "function");

      some.function(argument);

      Expect(() => Expect(some.function).toHaveBeenCalledWith(Any(String))).not.toThrow();
   }

   @TestCase("")
   @TestCase(new String(""))
   @TestCase("test")
   @TestCase(new String("test"))
   public anyStringArgumentShouldNotBeCalledShouldThrowIfStringArgument(argument: any) {
      const some = {
         function: (...args: Array<any>) => {}
      };

      SpyOn(some, "function");

      some.function(argument);

      Expect(() => Expect(some.function).not.toHaveBeenCalledWith(Any(String))).toThrowError(FunctionCallMatchError, "Expected function not to be called with [Any String].");
   }

   @TestCase(undefined)
   @TestCase(null)
   @TestCase(0)
   @TestCase(1)
   @TestCase(42)
   @TestCase(-42)
   @TestCase(new Number(0))
   @TestCase(new Number(1))
   @TestCase(new Number(42))
   @TestCase(new Number(-42))
   @TestCase(true)
   @TestCase(false)
   @TestCase(new Boolean(true))
   @TestCase(new Boolean(false))
   @TestCase({})
   @TestCase({ "an": "object"})
   @TestCase(new Object({}))
   @TestCase(new Object({ "an": "object"}))
   @TestCase([])
   @TestCase([ "an", "array" ])
   @TestCase(new Array([]))
   @TestCase(new Array([ "an", "array" ]))
   @TestCase(new Error())
   @TestCase(new Error("something went wrong"))
   public anyStringArgumentShouldThrowIfNonStringArgument(argument: any) {
      const some = {
         function: (...args: Array<any>) => {}
      };

      SpyOn(some, "function");

      some.function(argument);

      Expect(() => Expect(some.function).toHaveBeenCalledWith(Any(String))).toThrowError(FunctionCallMatchError, "Expected function to be called with [Any String].");
   }

   @TestCase(undefined)
   @TestCase(null)
   @TestCase(0)
   @TestCase(1)
   @TestCase(42)
   @TestCase(-42)
   @TestCase(new Number(0))
   @TestCase(new Number(1))
   @TestCase(new Number(42))
   @TestCase(new Number(-42))
   @TestCase(true)
   @TestCase(false)
   @TestCase(new Boolean(true))
   @TestCase(new Boolean(false))
   @TestCase({})
   @TestCase({ "an": "object"})
   @TestCase(new Object({}))
   @TestCase(new Object({ "an": "object"}))
   @TestCase([])
   @TestCase([ "an", "array" ])
   @TestCase(new Array([]))
   @TestCase(new Array([ "an", "array" ]))
   @TestCase(new Error())
   @TestCase(new Error("something went wrong"))
   public anyStringArgumentShouldThrowWithExpectedValueIfNonStringArgument(argument: any) {
      const some = {
         function: (...args: Array<any>) => {}
      };

      SpyOn(some, "function");
      some.function(argument);

      let functionCallError: FunctionCallMatchError;

      try {
         Expect(some.function).toHaveBeenCalledWith(Any(String));
      }
      catch (error) {
         functionCallError = error;
      }

      Expect(functionCallError).toBeDefined();
      Expect(functionCallError).not.toBeNull();
      Expect(functionCallError.expectedValue).toBe("function to be called with [Any String].");
   }

   @TestCase(true)
   @TestCase(false)
   @TestCase(new Boolean(true))
   @TestCase(new Boolean(false))
   public anyBooleanArgumentShouldNotThrowIfBooleanArgument(argument: any) {
      const some = {
         function: (...args: Array<any>) => {}
      };

      SpyOn(some, "function");

      some.function(argument);

      Expect(() => Expect(some.function).toHaveBeenCalledWith(Any(Boolean))).not.toThrow();
   }

   @TestCase(true)
   @TestCase(false)
   @TestCase(new Boolean(true))
   @TestCase(new Boolean(false))
   public anyBooleanArgumentShouldNotBeCalledShouldThrowIfBooleanArgument(argument: any) {
      const some = {
         function: (...args: Array<any>) => {}
      };

      SpyOn(some, "function");

      some.function(argument);

      Expect(() => Expect(some.function).not.toHaveBeenCalledWith(Any(Boolean))).toThrowError(FunctionCallMatchError, "Expected function not to be called with [Any Boolean].");
   }

   @TestCase(undefined)
   @TestCase(null)
   @TestCase(0)
   @TestCase(1)
   @TestCase(42)
   @TestCase(-42)
   @TestCase(new Number(0))
   @TestCase(new Number(1))
   @TestCase(new Number(42))
   @TestCase(new Number(-42))
   @TestCase("")
   @TestCase(new String(""))
   @TestCase("test")
   @TestCase(new String("test"))
   @TestCase({})
   @TestCase({ "an": "object"})
   @TestCase(new Object({}))
   @TestCase(new Object({ "an": "object"}))
   @TestCase([])
   @TestCase([ "an", "array" ])
   @TestCase(new Array([]))
   @TestCase(new Array([ "an", "array" ]))
   @TestCase(new Error())
   @TestCase(new Error("something went wrong"))
   public anyBooleanArgumentShouldThrowIfNonBooleanArgument(argument: any) {
      const some = {
         function: (...args: Array<any>) => {}
      };

      SpyOn(some, "function");

      some.function(argument);

      Expect(() => Expect(some.function).toHaveBeenCalledWith(Any(Boolean))).toThrowError(FunctionCallMatchError, "Expected function to be called with [Any Boolean].");
   }

   @TestCase(undefined)
   @TestCase(null)
   @TestCase(0)
   @TestCase(1)
   @TestCase(42)
   @TestCase(-42)
   @TestCase(new Number(0))
   @TestCase(new Number(1))
   @TestCase(new Number(42))
   @TestCase(new Number(-42))
   @TestCase("")
   @TestCase(new String(""))
   @TestCase("test")
   @TestCase(new String("test"))
   @TestCase({})
   @TestCase({ "an": "object"})
   @TestCase(new Object({}))
   @TestCase(new Object({ "an": "object"}))
   @TestCase([])
   @TestCase([ "an", "array" ])
   @TestCase(new Array([]))
   @TestCase(new Array([ "an", "array" ]))
   @TestCase(new Error())
   @TestCase(new Error("something went wrong"))
   public anyBooleanArgumentShouldThrowWithExpectedValueIfNonBooleanArgument(argument: any) {
      const some = {
         function: (...args: Array<any>) => {}
      };

      SpyOn(some, "function");
      some.function(argument);

      let functionCallError: FunctionCallMatchError;

      try {
         Expect(some.function).toHaveBeenCalledWith(Any(Boolean));
      }
      catch (error) {
         functionCallError = error;
      }

      Expect(functionCallError).toBeDefined();
      Expect(functionCallError).not.toBeNull();
      Expect(functionCallError.expectedValue).toBe("function to be called with [Any Boolean].");
   }

   @TestCase(new Number(0))
   @TestCase(new Number(1))
   @TestCase(new Number(42))
   @TestCase(new Number(-42))
   @TestCase(new String(""))
   @TestCase(new String("test"))
   @TestCase(new Boolean(true))
   @TestCase(new Boolean(false))
   @TestCase({})
   @TestCase({ "an": "object"})
   @TestCase(new Object({}))
   @TestCase(new Object({ "an": "object"}))
   @TestCase([])
   @TestCase([ "an", "array" ])
   @TestCase(new Array([]))
   @TestCase(new Array([ "an", "array" ]))
   @TestCase(new Error())
   @TestCase(new Error("something went wrong"))
   public anyObjectArgumentShouldNotThrowIfObjectArgument(argument: any) {
      const some = {
         function: (...args: Array<any>) => {}
      };

      SpyOn(some, "function");

      some.function(argument);

      Expect(() => Expect(some.function).toHaveBeenCalledWith(Any(Object))).not.toThrow();
   }

   @TestCase(new Number(0))
   @TestCase(new Number(1))
   @TestCase(new Number(42))
   @TestCase(new Number(-42))
   @TestCase(new String(""))
   @TestCase(new String("test"))
   @TestCase(new Boolean(true))
   @TestCase(new Boolean(false))
   @TestCase({})
   @TestCase({ "an": "object"})
   @TestCase(new Object({}))
   @TestCase(new Object({ "an": "object"}))
   @TestCase([])
   @TestCase([ "an", "array" ])
   @TestCase(new Array([]))
   @TestCase(new Array([ "an", "array" ]))
   @TestCase(new Error())
   @TestCase(new Error("something went wrong"))
   public anyObjectArgumentShouldNotBeCalledShouldThrowIfObjectArgument(argument: any) {
      const some = {
         function: (...args: Array<any>) => {}
      };

      SpyOn(some, "function");

      some.function(argument);

      Expect(() => Expect(some.function).not.toHaveBeenCalledWith(Any(Object))).toThrowError(FunctionCallMatchError, "Expected function not to be called with [Any Object].");
   }

   @TestCase(undefined)
   @TestCase(null)
   @TestCase(0)
   @TestCase(1)
   @TestCase(42)
   @TestCase(-42)
   @TestCase("")
   @TestCase("test")
   @TestCase(true)
   @TestCase(false)
   public anyObjectArgumentShouldThrowIfNonObjectArgument(argument: any) {
      const some = {
         function: (...args: Array<any>) => {}
      };

      SpyOn(some, "function");

      some.function(argument);

      Expect(() => Expect(some.function).toHaveBeenCalledWith(Any(Object))).toThrowError(FunctionCallMatchError, "Expected function to be called with [Any Object].");
   }

   @TestCase(undefined)
   @TestCase(null)
   @TestCase(0)
   @TestCase(1)
   @TestCase(42)
   @TestCase(-42)
   @TestCase("")
   @TestCase("test")
   @TestCase(true)
   @TestCase(false)
   public anyObjectArgumentShouldThrowWithExpectedValueIfNonObjectArgument(argument: any) {
      const some = {
         function: (...args: Array<any>) => {}
      };

      SpyOn(some, "function");
      some.function(argument);

      let functionCallError: FunctionCallMatchError;

      try {
         Expect(some.function).toHaveBeenCalledWith(Any(Object));
      }
      catch (error) {
         functionCallError = error;
      }

      Expect(functionCallError).toBeDefined();
      Expect(functionCallError).not.toBeNull();
      Expect(functionCallError.expectedValue).toBe("function to be called with [Any Object].");
   }

   @TestCase([])
   @TestCase([ "an", "array" ])
   @TestCase(new Array([]))
   @TestCase(new Array([ "an", "array" ]))
   public anyArrayArgumentShouldNotThrowIfArrayArgument(argument: any) {
      const some = {
         function: (...args: Array<any>) => {}
      };

      SpyOn(some, "function");

      some.function(argument);

      Expect(() => Expect(some.function).toHaveBeenCalledWith(Any(Array))).not.toThrow();
   }

   @TestCase([])
   @TestCase([ "an", "array" ])
   @TestCase(new Array([]))
   @TestCase(new Array([ "an", "array" ]))
   public anyArrayArgumentShouldNotBeCalledShouldThrowIfArrayArgument(argument: any) {
      const some = {
         function: (...args: Array<any>) => {}
      };

      SpyOn(some, "function");

      some.function(argument);

      Expect(() => Expect(some.function).not.toHaveBeenCalledWith(Any(Array))).toThrowError(FunctionCallMatchError, "Expected function not to be called with [Any Array].");
   }

   @TestCase(undefined)
   @TestCase(null)
   @TestCase(0)
   @TestCase(1)
   @TestCase(42)
   @TestCase(-42)
   @TestCase(new Number(0))
   @TestCase(new Number(1))
   @TestCase(new Number(42))
   @TestCase(new Number(-42))
   @TestCase("")
   @TestCase("test")
   @TestCase(new String(""))
   @TestCase(new String("test"))
   @TestCase(true)
   @TestCase(false)
   @TestCase(new Boolean(true))
   @TestCase(new Boolean(false))
   @TestCase({})
   @TestCase({ "an": "object"})
   @TestCase(new Object({}))
   @TestCase(new Object({ "an": "object"}))
   @TestCase(new Error())
   @TestCase(new Error("something went wrong"))
   public anyArrayArgumentShouldThrowIfNonArrayArgument(argument: any) {
      const some = {
         function: (...args: Array<any>) => {}
      };

      SpyOn(some, "function");

      some.function(argument);

      Expect(() => Expect(some.function).toHaveBeenCalledWith(Any(Array))).toThrowError(FunctionCallMatchError, "Expected function to be called with [Any Array].");
   }

   @TestCase(undefined)
   @TestCase(null)
   @TestCase(0)
   @TestCase(1)
   @TestCase(42)
   @TestCase(-42)
   @TestCase(new Number(0))
   @TestCase(new Number(1))
   @TestCase(new Number(42))
   @TestCase(new Number(-42))
   @TestCase("")
   @TestCase("test")
   @TestCase(new String(""))
   @TestCase(new String("test"))
   @TestCase(true)
   @TestCase(false)
   @TestCase(new Boolean(true))
   @TestCase(new Boolean(false))
   @TestCase({})
   @TestCase({ "an": "object"})
   @TestCase(new Object({}))
   @TestCase(new Object({ "an": "object"}))
   @TestCase(new Error())
   @TestCase(new Error("something went wrong"))
   public anyArrayArgumentShouldThrowWithExpectedValueIfNonArrayArgument(argument: any) {
      const some = {
         function: (...args: Array<any>) => {}
      };

      SpyOn(some, "function");
      some.function(argument);

      let functionCallError: FunctionCallMatchError;

      try {
         Expect(some.function).toHaveBeenCalledWith(Any(Array));
      }
      catch (error) {
         functionCallError = error;
      }

      Expect(functionCallError).toBeDefined();
      Expect(functionCallError).not.toBeNull();
      Expect(functionCallError.expectedValue).toBe("function to be called with [Any Array].");
   }

   @TestCase(new Error())
   @TestCase(new Error("something went wrong"))
   public anyErrorArgumentShouldNotThrowIfErrorArgument(argument: any) {
      const some = {
         function: (...args: Array<any>) => {}
      };

      SpyOn(some, "function");

      some.function(argument);

      Expect(() => Expect(some.function).toHaveBeenCalledWith(Any(Error))).not.toThrow();
   }

   @TestCase(new Error())
   @TestCase(new Error("something went wrong"))
   public anyErrorArgumentShouldNotBeCalledShouldThrowIfErrorArgument(argument: any) {
      const some = {
         function: (...args: Array<any>) => {}
      };

      SpyOn(some, "function");

      some.function(argument);

      Expect(() => Expect(some.function).not.toHaveBeenCalledWith(Any(Error))).toThrowError(FunctionCallMatchError, "Expected function not to be called with [Any Error].");
   }

   @TestCase(undefined)
   @TestCase(null)
   @TestCase(0)
   @TestCase(1)
   @TestCase(42)
   @TestCase(-42)
   @TestCase(new Number(0))
   @TestCase(new Number(1))
   @TestCase(new Number(42))
   @TestCase(new Number(-42))
   @TestCase("")
   @TestCase("test")
   @TestCase(new String(""))
   @TestCase(new String("test"))
   @TestCase(true)
   @TestCase(false)
   @TestCase(new Boolean(true))
   @TestCase(new Boolean(false))
   @TestCase({})
   @TestCase({ "an": "object"})
   @TestCase(new Object({}))
   @TestCase(new Object({ "an": "object"}))
   @TestCase([])
   @TestCase([ "an", "array" ])
   @TestCase(new Array([]))
   @TestCase(new Array([ "an", "array" ]))
   public anyErrorArgumentShouldThrowIfNonErrorArgument(argument: any) {
      const some = {
         function: (...args: Array<any>) => {}
      };

      SpyOn(some, "function");

      some.function(argument);

      Expect(() => Expect(some.function).toHaveBeenCalledWith(Any(Error))).toThrowError(FunctionCallMatchError, "Expected function to be called with [Any Error].");
   }

   @TestCase(undefined)
   @TestCase(null)
   @TestCase(0)
   @TestCase(1)
   @TestCase(42)
   @TestCase(-42)
   @TestCase(new Number(0))
   @TestCase(new Number(1))
   @TestCase(new Number(42))
   @TestCase(new Number(-42))
   @TestCase("")
   @TestCase("test")
   @TestCase(new String(""))
   @TestCase(new String("test"))
   @TestCase(true)
   @TestCase(false)
   @TestCase(new Boolean(true))
   @TestCase(new Boolean(false))
   @TestCase({})
   @TestCase({ "an": "object"})
   @TestCase(new Object({}))
   @TestCase(new Object({ "an": "object"}))
   @TestCase([])
   @TestCase([ "an", "array" ])
   @TestCase(new Array([]))
   @TestCase(new Array([ "an", "array" ]))
   public anyErrorArgumentShouldThrowWithExpectedValueIfNonErrorArgument(argument: any) {
      const some = {
         function: (...args: Array<any>) => {}
      };

      SpyOn(some, "function");
      some.function(argument);

      let functionCallError: FunctionCallMatchError;

      try {
         Expect(some.function).toHaveBeenCalledWith(Any(Error));
      }
      catch (error) {
         functionCallError = error;
      }

      Expect(functionCallError).toBeDefined();
      Expect(functionCallError).not.toBeNull();
      Expect(functionCallError.expectedValue).toBe("function to be called with [Any Error].");
   }

   @TestCase(0, Number)
   @TestCase(1, Number)
   @TestCase(42, Number)
   @TestCase(-42, Number)
   @TestCase(new Number(0), Number)
   @TestCase(new Number(1), Number)
   @TestCase(new Number(42), Number)
   @TestCase(new Number(-42), Number)
   @TestCase("", String)
   @TestCase("test", String)
   @TestCase(new String(""), String)
   @TestCase(new String("test"), String)
   @TestCase(true, Boolean)
   @TestCase(false, Boolean)
   @TestCase(new Boolean(true), Boolean)
   @TestCase(new Boolean(false), Boolean)
   @TestCase({}, Object)
   @TestCase({ "an": "object"}, Object)
   @TestCase(new Object({}), Object)
   @TestCase(new Object({ "an": "object"}), Object)
   @TestCase([], Array)
   @TestCase([ "an", "array" ], Array)
   @TestCase(new Array([]), Array)
   @TestCase(new Array([ "an", "array" ]), Array)
   public expectedAnyArgumentAndAnyTypeArgumentGivenCorrectArgumentsPass(argument: any, Type: new(...args: Array<any>) => Object) {
      const some = {
         function: (...args: Array<any>) => {}
      };

      SpyOn(some, "function");
      some.function(42, argument);

      Expect(() => Expect(some.function).toHaveBeenCalledWith(Any, Any(Type))).not.toThrow();
   }

   @TestCase(0, String)
   @TestCase(1, Boolean)
   @TestCase(42, Object)
   @TestCase(-42, Array)
   @TestCase(new Number(0), String)
   @TestCase(new Number(1), Boolean)
   @TestCase(new Number(42), Error)
   @TestCase(new Number(-42), Array)
   @TestCase("", Number)
   @TestCase("test", Boolean)
   @TestCase(new String(""), Array)
   @TestCase(new String("test"), Error)
   @TestCase(true, Number)
   @TestCase(false, Error)
   @TestCase(new Boolean(true), Array)
   @TestCase(new Boolean(false), String)
   @TestCase({}, Error)
   @TestCase({ "an": "object"}, Array)
   @TestCase(new Object({}), String)
   @TestCase(new Object({ "an": "object"}), Number)
   @TestCase([], Number)
   @TestCase([ "an", "array" ], String)
   @TestCase(new Array([]), Boolean)
   @TestCase(new Array([ "an", "array" ]), Error)
   public expectedAnyArgumentAndAnyTypeArgumentToThorwGivenIncorrectArgumentTypesPass(argument: any, Type: new(...args: Array<any>) => Object) {
      const some = {
         function: (...args: Array<any>) => {}
      };

      SpyOn(some, "function");
      some.function(42, argument);

      Expect(() => Expect(some.function).toHaveBeenCalledWith(Any, Any(Type))).toThrowError(FunctionCallMatchError, "Expected function to be called with [Anything, Any " + (<any>Type).name + "].");
   }

   @TestCase(0, Number)
   @TestCase(1, Number)
   @TestCase(42, Number)
   @TestCase(-42, Number)
   @TestCase(new Number(0), Number)
   @TestCase(new Number(1), Number)
   @TestCase(new Number(42), Number)
   @TestCase(new Number(-42), Number)
   @TestCase("", String)
   @TestCase("test", String)
   @TestCase(new String(""), String)
   @TestCase(new String("test"), String)
   @TestCase(true, Boolean)
   @TestCase(false, Boolean)
   @TestCase(new Boolean(true), Boolean)
   @TestCase(new Boolean(false), Boolean)
   @TestCase({}, Object)
   @TestCase({ "an": "object"}, Object)
   @TestCase(new Object({}), Object)
   @TestCase(new Object({ "an": "object"}), Object)
   @TestCase([], Array)
   @TestCase([ "an", "array" ], Array)
   @TestCase(new Array([]), Array)
   @TestCase(new Array([ "an", "array" ]), Array)
   public expectedAnyTypeArgumentAndAnyArgumentGivenCorrectArgumentsPass(argument: any, Type: new(...args: Array<any>) => Object) {
      const some = {
         function: (...args: Array<any>) => {}
      };

      SpyOn(some, "function");
      some.function(argument, 42);

      Expect(() => Expect(some.function).toHaveBeenCalledWith(Any(Type), Any)).not.toThrow();
   }

   @TestCase(0, String)
   @TestCase(1, Boolean)
   @TestCase(42, Object)
   @TestCase(-42, Array)
   @TestCase(new Number(0), String)
   @TestCase(new Number(1), Boolean)
   @TestCase(new Number(42), Error)
   @TestCase(new Number(-42), Array)
   @TestCase("", Number)
   @TestCase("test", Boolean)
   @TestCase(new String(""), Array)
   @TestCase(new String("test"), Error)
   @TestCase(true, Number)
   @TestCase(false, Error)
   @TestCase(new Boolean(true), Array)
   @TestCase(new Boolean(false), String)
   @TestCase({}, Error)
   @TestCase({ "an": "object"}, Array)
   @TestCase(new Object({}), String)
   @TestCase(new Object({ "an": "object"}), Number)
   @TestCase([], Number)
   @TestCase([ "an", "array" ], String)
   @TestCase(new Array([]), Boolean)
   @TestCase(new Array([ "an", "array" ]), Error)
   public expectedAnyTypeArgumentAndAnyArgumentToThorwGivenIncorrectArgumentTypesPass(argument: any, Type: new(...args: Array<any>) => Object) {
      const some = {
         function: (...args: Array<any>) => {}
      };

      SpyOn(some, "function");
      some.function(argument, 42);

      Expect(() => Expect(some.function).toHaveBeenCalledWith(Any(Type), Any)).toThrowError(FunctionCallMatchError, "Expected function to be called with [Any " + (<any>Type).name + ", Anything].");
   }

   @TestCase(0, Number)
   @TestCase(1, Number)
   @TestCase(42, Number)
   @TestCase(-42, Number)
   @TestCase(new Number(0), Number)
   @TestCase(new Number(1), Number)
   @TestCase(new Number(42), Number)
   @TestCase(new Number(-42), Number)
   @TestCase("", String)
   @TestCase("test", String)
   @TestCase(new String(""), String)
   @TestCase(new String("test"), String)
   @TestCase(true, Boolean)
   @TestCase(false, Boolean)
   @TestCase(new Boolean(true), Boolean)
   @TestCase(new Boolean(false), Boolean)
   @TestCase({}, Object)
   @TestCase({ "an": "object"}, Object)
   @TestCase(new Object({}), Object)
   @TestCase(new Object({ "an": "object"}), Object)
   @TestCase([], Array)
   @TestCase([ "an", "array" ], Array)
   @TestCase(new Array([]), Array)
   @TestCase(new Array([ "an", "array" ]), Array)
   public expectedExactArgumentAndAnyTypeArgumentGivenCorrectArgumentsPass(argument: any, Type: new(...args: Array<any>) => Object) {
      const some = {
         function: (...args: Array<any>) => {}
      };

      SpyOn(some, "function");
      some.function(42, argument);

      Expect(() => Expect(some.function).toHaveBeenCalledWith(42, Any(Type))).not.toThrow();
   }

   @TestCase(0, String)
   @TestCase(1, Boolean)
   @TestCase(42, Object)
   @TestCase(-42, Array)
   @TestCase(new Number(0), String)
   @TestCase(new Number(1), Boolean)
   @TestCase(new Number(42), Error)
   @TestCase(new Number(-42), Array)
   @TestCase("", Number)
   @TestCase("test", Boolean)
   @TestCase(new String(""), Array)
   @TestCase(new String("test"), Error)
   @TestCase(true, Number)
   @TestCase(false, Error)
   @TestCase(new Boolean(true), Array)
   @TestCase(new Boolean(false), String)
   @TestCase({}, Error)
   @TestCase({ "an": "object"}, Array)
   @TestCase(new Object({}), String)
   @TestCase(new Object({ "an": "object"}), Number)
   @TestCase([], Number)
   @TestCase([ "an", "array" ], String)
   @TestCase(new Array([]), Boolean)
   @TestCase(new Array([ "an", "array" ]), Error)
   public expectedExactArgumentAndAnyTypeArgumentToThorwGivenIncorrectArgumentTypesPass(argument: any, Type: new(...args: Array<any>) => Object) {
      const some = {
         function: (...args: Array<any>) => {}
      };

      SpyOn(some, "function");
      some.function(42, argument);

      Expect(() => Expect(some.function).toHaveBeenCalledWith(42, Any(Type))).toThrowError(FunctionCallMatchError, "Expected function to be called with [42, Any " + (<any>Type).name + "].");
   }

   @TestCase(0, Number)
   @TestCase(1, Number)
   @TestCase(42, Number)
   @TestCase(-42, Number)
   @TestCase(new Number(0), Number)
   @TestCase(new Number(1), Number)
   @TestCase(new Number(42), Number)
   @TestCase(new Number(-42), Number)
   @TestCase("", String)
   @TestCase("test", String)
   @TestCase(new String(""), String)
   @TestCase(new String("test"), String)
   @TestCase(true, Boolean)
   @TestCase(false, Boolean)
   @TestCase(new Boolean(true), Boolean)
   @TestCase(new Boolean(false), Boolean)
   @TestCase({}, Object)
   @TestCase({ "an": "object"}, Object)
   @TestCase(new Object({}), Object)
   @TestCase(new Object({ "an": "object"}), Object)
   @TestCase([], Array)
   @TestCase([ "an", "array" ], Array)
   @TestCase(new Array([]), Array)
   @TestCase(new Array([ "an", "array" ]), Array)
   public expectedAnyTypeArgumentAndExactArgumentGivenCorrectArgumentsPass(argument: any, Type: new(...args: Array<any>) => Object) {
      const some = {
         function: (...args: Array<any>) => {}
      };

      SpyOn(some, "function");
      some.function(argument, 42);

      Expect(() => Expect(some.function).toHaveBeenCalledWith(Any(Type), 42)).not.toThrow();
   }

   @TestCase(0, String)
   @TestCase(1, Boolean)
   @TestCase(42, Object)
   @TestCase(-42, Array)
   @TestCase(new Number(0), String)
   @TestCase(new Number(1), Boolean)
   @TestCase(new Number(42), Error)
   @TestCase(new Number(-42), Array)
   @TestCase("", Number)
   @TestCase("test", Boolean)
   @TestCase(new String(""), Array)
   @TestCase(new String("test"), Error)
   @TestCase(true, Number)
   @TestCase(false, Error)
   @TestCase(new Boolean(true), Array)
   @TestCase(new Boolean(false), String)
   @TestCase({}, Error)
   @TestCase({ "an": "object"}, Array)
   @TestCase(new Object({}), String)
   @TestCase(new Object({ "an": "object"}), Number)
   @TestCase([], Number)
   @TestCase([ "an", "array" ], String)
   @TestCase(new Array([]), Boolean)
   @TestCase(new Array([ "an", "array" ]), Error)
   public expectedAnyTypeArgumentAndExactArgumentToThorwGivenIncorrectArgumentTypesPass(argument: any, Type: new(...args: Array<any>) => Object) {
      const some = {
         function: (...args: Array<any>) => {}
      };

      SpyOn(some, "function");
      some.function(argument, 42);

      Expect(() => Expect(some.function).toHaveBeenCalledWith(Any(Type), 42)).toThrowError(FunctionCallMatchError, "Expected function to be called with [Any " + (<any>Type).name + ", 42].");
   }

   @TestCase(0)
   @TestCase(1)
   @TestCase(42)
   @TestCase(-42)
   @TestCase(new Number(0))
   @TestCase(new Number(1))
   @TestCase(new Number(42))
   @TestCase(new Number(-42))
   @TestCase("")
   @TestCase("test")
   @TestCase(new String(""))
   @TestCase(new String("test"))
   @TestCase(true)
   @TestCase(false)
   @TestCase(new Boolean(true))
   @TestCase(new Boolean(false))
   @TestCase({})
   @TestCase({ "an": "object"})
   @TestCase(new Object({}))
   @TestCase(new Object({ "an": "object"}))
   @TestCase([])
   @TestCase([ "an", "array" ])
   @TestCase(new Array([]))
   @TestCase(new Array([ "an", "array" ]))
   public expectedExactArgumentAndAnyArgumentGivenCorrectArgumentsPass(argument: any) {
      const some = {
         function: (...args: Array<any>) => {}
      };

      SpyOn(some, "function");
      some.function(42, argument);

      Expect(() => Expect(some.function).toHaveBeenCalledWith(42, Any)).not.toThrow();
   }

   @TestCase(0)
   @TestCase(1)
   @TestCase(42)
   @TestCase(-42)
   @TestCase(new Number(0))
   @TestCase(new Number(1))
   @TestCase(new Number(42))
   @TestCase(new Number(-42))
   @TestCase("")
   @TestCase("test")
   @TestCase(new String(""))
   @TestCase(new String("test"))
   @TestCase(true)
   @TestCase(false)
   @TestCase(new Boolean(true))
   @TestCase(new Boolean(false))
   @TestCase({})
   @TestCase({ "an": "object"})
   @TestCase(new Object({}))
   @TestCase(new Object({ "an": "object"}))
   @TestCase([])
   @TestCase([ "an", "array" ])
   @TestCase(new Array([]))
   @TestCase(new Array([ "an", "array" ]))
   @TestCase(new Array([ "an", "array" ]))
   public expectedAnyArgumentAndExactArgumentGivenCorrectArgumentsPass(argument: any) {
      const some = {
         function: (...args: Array<any>) => {}
      };

      SpyOn(some, "function");
      some.function(argument, 42);

      Expect(() => Expect(some.function).toHaveBeenCalledWith(Any, 42)).not.toThrow();
   }

   @TestCase(1)
   @TestCase(2)
   @TestCase(42)
   public calledExactlyCorrectNumberOfTimesWithCorrectArgumentsPasses(expectedCallCount: number) {
      const some = {
         function: (...args: Array<any>) => {}
      };

      SpyOn(some, "function");

      for (let i = 0; i < expectedCallCount; i++) {
         some.function(42);
      }

      Expect(() => Expect(some.function).toHaveBeenCalledWith(42).exactly(expectedCallCount).times).not.toThrow();
   }

   @TestCase(2)
   @TestCase(3)
   @TestCase(42)
   public calledExactlyCorrectNumberOfTimesWithWrongArgumentsThrowsError(expectedCallCount: number) {
      const some = {
         function: (...args: Array<any>) => {}
      };

      SpyOn(some, "function");

      // called once but not correct amount of times
      some.function(42);

      for (let i = 0; i < expectedCallCount; i++) {
         some.function(43);
      }

      if (expectedCallCount === 1) {
         Expect(() => Expect(some.function).toHaveBeenCalledWith(42).exactly(expectedCallCount).times).toThrowError(FunctionCallCountMatchError, "Expected function to be called with [42] 1 time.");
      }
      else {
         Expect(() => Expect(some.function).toHaveBeenCalledWith(42).exactly(expectedCallCount).times).toThrowError(FunctionCallCountMatchError, `Expected function to be called with [42] ${expectedCallCount} times.`);
      }
   }
   //TODO: exactly matches
   //TODO: exactly doesn't match
   //TODO: exactly doesn't match with wrong arguments
   //TODO: exactly doesn't match with right arguments in the wrong order

   //TODO: not exactly matches
   //TODO: not exactly doesn't match
   //TODO: not exactly matches with wrong arguments
   //TODO: not exactly doesn't match with right arguments in the wrong order

   //TODO: greater than matches
   //TODO: greater than doesn't match
   //TODO: greater than doesn't match with wrong arguments
   //TODO: greater than doesn't match with right arguments in the wrong order

   //TODO: less than matches
   //TODO: less than doesn't match
   //TODO: less than doesn't match with wrong arguments
   //TODO: less than doesn't match with right arguments in the wrong order
}
