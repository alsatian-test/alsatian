import { FunctionCallMatchError } from "../../../core/errors/function-call-match-error";
import { Expect, Test, TestCase } from "../../../core/alsatian-core";

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

      Expect(error.expectedValue).toBe("function to be called with " + JSON.stringify(expectedArguments) + ".");
   }

   @TestCase([])
   @TestCase([1])
   @TestCase(["something"])
   @TestCase([1, "or", 2, "other", "things"])
   public expectedValueAndShouldNotMatchShouldBeSetToFunctionNotToBeCalledWithArguments(expectedArguments: Array<any>) {
      let fakeFunction: any = { calls: [ ] };

      fakeFunction.calls.push({ args: expectedArguments });

      let error = new FunctionCallMatchError(fakeFunction, false, expectedArguments);

      Expect(error.expectedValue).toBe("function not to be called with " + JSON.stringify(expectedArguments) + ".");
   }
}
