import { FunctionCallMatchError } from "../../../core/errors/function-call-match-error";
import { Expect, Test, TestCase, Any, FocusTests } from "../../../core/alsatian-core";

@FocusTests
export class FunctionCallMatchErrorTests {

   @Test()
   public shouldBeCalledMessage() {
      let fakeFunction: any = { calls: [ ] };

      let error = new FunctionCallMatchError(fakeFunction, true);

      Expect(error.message).toBe("Expected function to be called.");
   }

   @Test()
   public shouldNotBeCalledMessage() {
      let fakeFunction: any = { calls: [ ] };

      fakeFunction.calls.push({ args: [] });

      let error = new FunctionCallMatchError(fakeFunction, false);

      Expect(error.message).toBe("Expected function not to be called.");
   }

   @Test()
   public actualValueAndShouldMatchShouldBeSetToFunctionWasNotCalled() {
      let fakeFunction: any = { calls: [ ] };

      fakeFunction.calls.push({ args: [] });

      let error = new FunctionCallMatchError(fakeFunction, true);

      Expect(error.actualValue).toBe("function was not called.");
   }

   @Test()
   public actualValueAndShouldNotMatchShouldBeSetToFunctionWasCalled() {
      let fakeFunction: any = { calls: [ ] };

      fakeFunction.calls.push({ args: [] });

      let error = new FunctionCallMatchError(fakeFunction, false);

      Expect(error.actualValue).toBe("function was called.");
   }

   @Test()
   public expectedValueAndShouldMatchShouldBeSetToFunctionToBeCalled() {
      let fakeFunction: any = { calls: [ ] };

      fakeFunction.calls.push({ args: [] });

      let error = new FunctionCallMatchError(fakeFunction, true);

      Expect(error.expectedValue).toBe("function to be called.");
   }

   @Test()
   public expectedValueAndShouldNotMatchShouldBeSetToFunctionNotToBeCalled() {
      let fakeFunction: any = { calls: [ ] };

      fakeFunction.calls.push({ args: [] });

      let error = new FunctionCallMatchError(fakeFunction, false);

      Expect(error.expectedValue).toBe("function not to be called.");
   }

   @TestCase([ "this" ])
   @TestCase([ "this", "that" ])
   @TestCase([ 1, 2, 3 ])
   public shouldBeCalledWithArgsMessage(args: Array<any>) {
      let fakeFunction: any = { calls: [ ] };

      fakeFunction.calls.push({ args: [] });

      let error = new FunctionCallMatchError(fakeFunction, true, args);

      Expect(error.message).toBe("Expected function to be called with [" + args.map(arg => JSON.stringify(arg)).join(", ") + "].");
   }

   @TestCase([ "this" ])
   @TestCase([ "this", "that" ])
   @TestCase([ 1, 2, 3 ])
   public shouldNotBeCalledWithArgsMessage(args: Array<any>) {
      let fakeFunction: any = { calls: [ ] };

      fakeFunction.calls.push({ args: args });

      let error = new FunctionCallMatchError(fakeFunction, false, args);

      Expect(error.message).toBe("Expected function not to be called with [" + args.map(arg => JSON.stringify(arg)).join(", ") + "].");
   }

   @TestCase([[]])
   @TestCase([[], []])
   @TestCase([[1], [2], [3]])
   @TestCase([["something", "and", "another", "thing"]])
   @TestCase([["this", "or"], ["that", "other", "thing"]])
   public actualValueAndShouldMatchShouldBeSetToFunctionWasNotCalledWithArguments(actualArgumentsList: Array<Array<any>>) {
      let fakeFunction: any = { calls: [ ] };

      actualArgumentsList.forEach(actualArguments => {
         fakeFunction.calls.push({ args: actualArguments });
      });

      let error = new FunctionCallMatchError(fakeFunction, true, []);

      Expect(error.actualValue).toBe("function was called with " + actualArgumentsList.map(args => JSON.stringify(args)).join(", ") + ".");
   }

   @TestCase([[]])
   @TestCase([[], []])
   @TestCase([[1], [2], [3]])
   @TestCase([["something", "and", "another", "thing"]])
   @TestCase([["this", "or"], ["that", "other", "thing"]])
   public actualValueAndShouldNotMatchShouldBeSetToFunctionWasCalledWithArguments(actualArgumentsList: Array<Array<any>>) {
      let fakeFunction: any = { calls: [ ] };

      actualArgumentsList.forEach(actualArguments => {
         fakeFunction.calls.push({ args: actualArguments });
      });

      let error = new FunctionCallMatchError(fakeFunction, false, []);

      Expect(error.actualValue).toBe("function was called with " + actualArgumentsList.map(args => JSON.stringify(args)).join(", ") + ".");
   }

   @TestCase([])
   @TestCase([1])
   @TestCase(["something"])
   @TestCase([1, "or", 2, "other", "things"])
   public expectedValueAndShouldMatchShouldBeSetToFunctionToBeCalledWithArguments(expectedArguments: Array<any>) {
      let fakeFunction: any = { calls: [ ] };

      let error = new FunctionCallMatchError(fakeFunction, true, expectedArguments);

      Expect(error.expectedValue).toBe("function to be called with " + JSON.stringify(expectedArguments).replace(/,/g, ", ") + ".");
   }

   @TestCase([])
   @TestCase([1])
   @TestCase(["something"])
   @TestCase([1, "or", 2, "other", "things"])
   public expectedValueAndShouldNotMatchShouldBeSetToFunctionNotToBeCalledWithArguments(expectedArguments: Array<any>) {
      let fakeFunction: any = { calls: [ ] };

      fakeFunction.calls.push({ args: expectedArguments });

      let error = new FunctionCallMatchError(fakeFunction, false, expectedArguments);

      Expect(error.expectedValue).toBe("function not to be called with " + JSON.stringify(expectedArguments).replace(/,/g, ", ") + ".");
   }

   @Test()
   public anyArgumentOutputAsAnythingInMessage() {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, true, [ Any ])

      Expect(functionCallError.message).toBe("Expected function to be called with [Anything].");
   }
   /*
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
      }*/
}
