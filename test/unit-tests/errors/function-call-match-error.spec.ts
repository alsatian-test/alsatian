import { FunctionCallMatchError } from "../../../core/errors/function-call-match-error";
import { Expect, Test, TestCase, Any } from "../../../core/alsatian-core";

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

      Expect(error.actual).toBe("function was not called.");
   }

   @Test()
   public actualValueAndShouldNotMatchShouldBeSetToFunctionWasCalled() {
      let fakeFunction: any = { calls: [ ] };

      fakeFunction.calls.push({ args: [] });

      let error = new FunctionCallMatchError(fakeFunction, false);

      Expect(error.actual).toBe("function was called.");
   }

   @Test()
   public expectedValueAndShouldMatchShouldBeSetToFunctionToBeCalled() {
      let fakeFunction: any = { calls: [ ] };

      fakeFunction.calls.push({ args: [] });

      let error = new FunctionCallMatchError(fakeFunction, true);

      Expect(error.expected).toBe("function to be called.");
   }

   @Test()
   public expectedValueAndShouldNotMatchShouldBeSetToFunctionNotToBeCalled() {
      let fakeFunction: any = { calls: [ ] };

      fakeFunction.calls.push({ args: [] });

      let error = new FunctionCallMatchError(fakeFunction, false);

      Expect(error.expected).toBe("function not to be called.");
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

      Expect(error.actual).toBe("function was called with " + actualArgumentsList.map(args => JSON.stringify(args)).join(", ") + ".");
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

      Expect(error.actual).toBe("function was called with " + actualArgumentsList.map(args => JSON.stringify(args)).join(", ") + ".");
   }

   @TestCase([])
   @TestCase([1])
   @TestCase(["something"])
   @TestCase([1, "or", 2, "other", "things"])
   public expectedValueAndShouldMatchShouldBeSetToFunctionToBeCalledWithArguments(expectedArguments: Array<any>) {
      let fakeFunction: any = { calls: [ ] };

      let error = new FunctionCallMatchError(fakeFunction, true, expectedArguments);

      Expect(error.expected).toBe("function to be called with " + JSON.stringify(expectedArguments).replace(/,/g, ", ") + ".");
   }

   @TestCase([])
   @TestCase([1])
   @TestCase(["something"])
   @TestCase([1, "or", 2, "other", "things"])
   public expectedValueAndShouldNotMatchShouldBeSetToFunctionNotToBeCalledWithArguments(expectedArguments: Array<any>) {
      let fakeFunction: any = { calls: [ ] };

      fakeFunction.calls.push({ args: expectedArguments });

      let error = new FunctionCallMatchError(fakeFunction, false, expectedArguments);

      Expect(error.expected).toBe("function not to be called with " + JSON.stringify(expectedArguments).replace(/,/g, ", ") + ".");
   }

   @Test()
   public anyArgumentOutputAsAnythingInMessage() {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, true, [ Any ]);

      Expect(functionCallError.message).toBe("Expected function to be called with [Anything].");
   }

   @Test()
   public twoAnyArgumentsBothOutputAsAnythingInMessage() {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, true, [ Any, Any ]);

      Expect(functionCallError.message).toBe("Expected function to be called with [Anything, Anything].");
   }

   @Test()
   public anyArgumentOutputAsAnythingInNotExpectedMessage() {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, false, [ Any ]);

      Expect(functionCallError.message).toBe("Expected function not to be called with [Anything].");
   }

   @Test()
   public twoAnyArgumentsBothOutputAsAnythingInNotExpectedMessage() {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, false, [ Any, Any ]);

      Expect(functionCallError.message).toBe("Expected function not to be called with [Anything, Anything].");
   }

   @Test()
   public anyArgumentOutputAsAnythingInExpectedValue() {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, true, [ Any ]);

      Expect(functionCallError.expected).toBe("function to be called with [Anything].");
   }

   @Test()
   public twoAnyArgumentsBothOutputAsAnythingInExpectedValue() {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, true, [ Any, Any ]);

      Expect(functionCallError.expected).toBe("function to be called with [Anything, Anything].");
   }

   @Test()
   public anyArgumentOutputAsAnythingInNotExpectedValue() {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, false, [ Any ]);

      Expect(functionCallError.expected).toBe("function not to be called with [Anything].");
   }

   @Test()
   public twoAnyArgumentsBothOutputAsAnythingInNotExpectedValue() {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, false, [ Any, Any ]);

      Expect(functionCallError.expected).toBe("function not to be called with [Anything, Anything].");
   }

   @TestCase(Number)
   @TestCase(String)
   @TestCase(Object)
   @TestCase(Array)
   public anyTypeArgumentOutputAsAnyTypeInMessage(Type: new (...args: Array<any>) => Object) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, true, [ Any(Type) ]);

      Expect(functionCallError.message).toBe("Expected function to be called with [Any " + (<any>Type).name + "].");
   }

   @TestCase(Number, Array)
   @TestCase(String, Object)
   @TestCase(Object, String)
   @TestCase(Array, Number)
   public twoAnyTypeArgumentsBothOutputAsAnyTypeInMessage(TypeOne: new (...args: Array<any>) => Object, TypeTwo: new (...args: Array<any>) => Object) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, true, [ Any(TypeOne), Any(TypeTwo) ]);

      Expect(functionCallError.message).toBe("Expected function to be called with [Any " + (<any>TypeOne).name + ", Any " + (<any>TypeTwo).name + "].");
   }

   @TestCase(Number)
   @TestCase(String)
   @TestCase(Object)
   @TestCase(Array)
   public anyTypeArgumentOutputAsAnyTypeInNotExpectedMessage(Type: new (...args: Array<any>) => Object) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, false, [ Any(Type) ]);

      Expect(functionCallError.message).toBe("Expected function not to be called with [Any " + (<any>Type).name + "].");
   }

   @TestCase(Number, Array)
   @TestCase(String, Object)
   @TestCase(Object, String)
   @TestCase(Array, Number)
   public twoAnyTypeArgumentsBothOutputAsAnyTyoeInNotExpectedMessage(TypeOne: new (...args: Array<any>) => Object, TypeTwo: new (...args: Array<any>) => Object) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, false, [ Any(TypeOne), Any(TypeTwo) ]);

      Expect(functionCallError.message).toBe("Expected function not to be called with [Any " + (<any>TypeOne).name + ", Any " + (<any>TypeTwo).name + "].");
   }

   @TestCase(Number)
   @TestCase(String)
   @TestCase(Object)
   @TestCase(Array)
   public anyTypeArgumentOutputAsAnyTypeInExpectedValue(Type: new (...args: Array<any>) => Object) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, true, [ Any(Type) ]);

      Expect(functionCallError.expected).toBe("function to be called with [Any " + (<any>Type).name +  "].");
   }

   @TestCase(Number, Array)
   @TestCase(String, Object)
   @TestCase(Object, String)
   @TestCase(Array, Number)
   public twoAnyTypeArgumentsBothOutputAsAnyTypeInExpectedValue(TypeOne: new (...args: Array<any>) => Object, TypeTwo: new (...args: Array<any>) => Object) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, true, [ Any(TypeOne), Any(TypeTwo) ]);

      Expect(functionCallError.expected).toBe("function to be called with [Any " + (<any>TypeOne).name + ", Any " + (<any>TypeTwo).name + "].");
   }

   @TestCase(Number)
   @TestCase(String)
   @TestCase(Object)
   @TestCase(Array)
   public anyTypeArgumentOutputAsAnyTypeInNotExpectedValue(Type: new (...args: Array<any>) => Object) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, false, [ Any(Type) ]);

      Expect(functionCallError.expected).toBe("function not to be called with [Any " + (<any>Type).name + "].");
   }

   @TestCase(Number, Array)
   @TestCase(String, Object)
   @TestCase(Object, String)
   @TestCase(Array, Number)
   public twoAnyTypeArgumentsBothOutputAsAnyTypeInNotExpectedValue(TypeOne: new (...args: Array<any>) => Object, TypeTwo: new (...args: Array<any>) => Object) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, false, [ Any(TypeOne), Any(TypeTwo) ]);

      Expect(functionCallError.expected).toBe("function not to be called with [Any " + (<any>TypeOne).name + ", Any " + (<any>TypeTwo).name + "].");
   }

   @TestCase(Number)
   @TestCase(String)
   @TestCase(Object)
   @TestCase(Array)
   public anyAndAnyTypeArgumentsBothOutputAsAnythingAndAnyTypeInMessage(Type: new (...args: Array<any>) => Object) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, true, [ Any, Any(Type) ]);

      Expect(functionCallError.message).toBe("Expected function to be called with [Anything, Any " + (<any>Type).name + "].");
   }

   @TestCase(Number)
   @TestCase(String)
   @TestCase(Object)
   @TestCase(Array)
   public anyAndAnyTypeArgumentsBothOutputAsAnythingAndAnyTypeInMessageAnyTyoeInNotExpectedMessage(Type: new (...args: Array<any>) => Object) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, false, [ Any, Any(Type) ]);

      Expect(functionCallError.message).toBe("Expected function not to be called with [Anything, Any " + (<any>Type).name + "].");
   }

   @TestCase(Number)
   @TestCase(String)
   @TestCase(Object)
   @TestCase(Array)
   public anyAndAnyTypeArgumentsBothOutputAsAnythingAndAnyTypeInExpectedValue(Type: new (...args: Array<any>) => Object) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, true, [ Any, Any(Type) ]);

      Expect(functionCallError.expected).toBe("function to be called with [Anything, Any " + (<any>Type).name + "].");
   }

   @TestCase(Number)
   @TestCase(String)
   @TestCase(Object)
   @TestCase(Array)
   public anyAndAnyTypeArgumentsBothOutputAsAnythignAndAnyTypeInNotExpectedValue(Type: new (...args: Array<any>) => Object) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, false, [ Any, Any(Type) ]);

      Expect(functionCallError.expected).toBe("function not to be called with [Anything, Any " + (<any>Type).name + "].");
   }

   @TestCase(Number)
   @TestCase(String)
   @TestCase(Object)
   @TestCase(Array)
   public anyTypeAndAnyArgumentsBothOutputAsAnyTypeAndAnythingInMessage(Type: new (...args: Array<any>) => Object) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, true, [ Any(Type), Any ]);

      Expect(functionCallError.message).toBe("Expected function to be called with [Any " + (<any>Type).name + ", Anything].");
   }

   @TestCase(Number)
   @TestCase(String)
   @TestCase(Object)
   @TestCase(Array)
   public anyTypeAndAnyArgumentsBothOutputAsAnyTypeAndAnythingInMessageAnyTyoeInNotExpectedMessage(Type: new (...args: Array<any>) => Object) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, false, [ Any(Type), Any ]);

      Expect(functionCallError.message).toBe("Expected function not to be called with [Any " + (<any>Type).name + ", Anything].");
   }

   @TestCase(Number)
   @TestCase(String)
   @TestCase(Object)
   @TestCase(Array)
   public anyTypeAndAnyArgumentsBothOutputAsAnyTypeAndAnythingInExpectedValue(Type: new (...args: Array<any>) => Object) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, true, [ Any(Type), Any ]);

      Expect(functionCallError.expected).toBe("function to be called with [Any " + (<any>Type).name + ", Anything].");
   }

   @TestCase(Number)
   @TestCase(String)
   @TestCase(Object)
   @TestCase(Array)
   public anyTypeAndAnyArgumentsBothOutputAsAnyTypeAndAnythingInNotExpectedValue(Type: new (...args: Array<any>) => Object) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, false, [ Any(Type), Any ]);

      Expect(functionCallError.expected).toBe("function not to be called with [Any " + (<any>Type).name + ", Anything].");
   }

   @TestCase("test")
   @TestCase(42)
   @TestCase("something else")
   @TestCase(-42)
   public exactAndAnyArgumentsBothOutputAsExactAndAnythingInMessage( exactValue: any) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, true, [ exactValue, Any]);

      Expect(functionCallError.message).toBe("Expected function to be called with [" + JSON.stringify(exactValue) + ", Anything].");
   }

   @TestCase("test")
   @TestCase(42)
   @TestCase("something else")
   @TestCase(-42)
   public exactAndAnyArgumentsBothOutputAsExactAndAnythingInMessageAnyTyoeInNotExpectedMessage(exactValue: any) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, false, [ exactValue, Any]);

      Expect(functionCallError.message).toBe("Expected function not to be called with [" + JSON.stringify(exactValue) + ", Anything].");
   }

   @TestCase("test")
   @TestCase(42)
   @TestCase("something else")
   @TestCase(-42)
   public exactAndAnyArgumentsBothOutputAsExactAndAnythingInExpectedValue(exactValue: any) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, true, [ exactValue, Any]);

      Expect(functionCallError.expected).toBe("function to be called with [" + JSON.stringify(exactValue) + ", Anything].");
   }

   @TestCase("test")
   @TestCase(42)
   @TestCase("something else")
   @TestCase(-42)
   public exactAndAnyArgumentsBothOutputAsExactAndAnythingInNotExpectedValue(exactValue: any) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, false, [ exactValue, Any]);

      Expect(functionCallError.expected).toBe("function not to be called with [" + JSON.stringify(exactValue) + ", Anything].");
   }

   @TestCase("test")
   @TestCase(42)
   @TestCase("something else")
   @TestCase(-42)
   public anyAndExactArgumentsBothOutputAsAnythingAndExactInMessage(exactValue: any) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, true, [ Any, exactValue ]);

      Expect(functionCallError.message).toBe("Expected function to be called with [Anything, " + JSON.stringify(exactValue) + "].");
   }

   @TestCase("test")
   @TestCase(42)
   @TestCase("something else")
   @TestCase(-42)
   public anyAndExaactArgumentsBothOutputAsAnythingAndExactInMessageAnyTyoeInNotExpectedMessage( exactValue: any) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, false, [ Any, exactValue ]);

      Expect(functionCallError.message).toBe("Expected function not to be called with [Anything, " + JSON.stringify(exactValue) + "].");
   }

   @TestCase("test")
   @TestCase(42)
   @TestCase("something else")
   @TestCase(-42)
   public anyAndExactArgumentsBothOutputAsAnythingAndExactInExpectedValue(exactValue: any) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, true, [ Any, exactValue ]);

      Expect(functionCallError.expected).toBe("function to be called with [Anything, " + JSON.stringify(exactValue) + "].");
   }

   @TestCase("test")
   @TestCase(42)
   @TestCase("something else")
   @TestCase(-42)
   public anyAndExactArgumentsBothOutputAsAnythingAndExactInNotExpectedValue(exactValue: any) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, false, [ Any, exactValue ]);

      Expect(functionCallError.expected).toBe("function not to be called with [Anything, " + JSON.stringify(exactValue) + "].");
   }

   @TestCase(Number, "test")
   @TestCase(String, 42)
   @TestCase(Object, "something else")
   @TestCase(Array, -42)
   public exactAndAnyTypeArgumentsBothOutputAsExactAndAnyTypeInMessage(Type: new (...args: Array<any>) => Object, exactValue: any) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, true, [ exactValue, Any(Type) ]);

      Expect(functionCallError.message).toBe("Expected function to be called with [" + JSON.stringify(exactValue) + ", Any " + (<any>Type).name + "].");
   }

   @TestCase(Number, "test")
   @TestCase(String, 42)
   @TestCase(Object, "something else")
   @TestCase(Array, -42)
   public exactAndAnyTypeArgumentsBothOutputAsExactAndAnyTypeInMessageAnyTyoeInNotExpectedMessage(Type: new (...args: Array<any>) => Object, exactValue: any) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, false, [ exactValue, Any(Type) ]);

      Expect(functionCallError.message).toBe("Expected function not to be called with [" + JSON.stringify(exactValue) + ", Any " + (<any>Type).name + "].");
   }

   @TestCase(Number, "test")
   @TestCase(String, 42)
   @TestCase(Object, "something else")
   @TestCase(Array, -42)
   public exactAndAnyTypeArgumentsBothOutputAsExactAndAnyTypeInExpectedValue(Type: new (...args: Array<any>) => Object, exactValue: any) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, true, [ exactValue, Any(Type) ]);

      Expect(functionCallError.expected).toBe("function to be called with [" + JSON.stringify(exactValue) + ", Any " + (<any>Type).name + "].");
   }

   @TestCase(Number, "test")
   @TestCase(String, 42)
   @TestCase(Object, "something else")
   @TestCase(Array, -42)
   public exactAndAnyTypeArgumentsBothOutputAsExactAndAnyTypeInNotExpectedValue(Type: new (...args: Array<any>) => Object, exactValue: any) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, false, [ exactValue, Any(Type) ]);

      Expect(functionCallError.expected).toBe("function not to be called with [" + JSON.stringify(exactValue) + ", Any " + (<any>Type).name + "].");
   }

   @TestCase(Number, "test")
   @TestCase(String, 42)
   @TestCase(Object, "something else")
   @TestCase(Array, -42)
   public anyTypeAndExactArgumentsBothOutputAsAnyTypeAndExactInMessage(Type: new (...args: Array<any>) => Object, exactValue: any) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, true, [ Any(Type), exactValue ]);

      Expect(functionCallError.message).toBe("Expected function to be called with [Any " + (<any>Type).name + ", " + JSON.stringify(exactValue) + "].");
   }

   @TestCase(Number, "test")
   @TestCase(String, 42)
   @TestCase(Object, "something else")
   @TestCase(Array, -42)
   public anyTypeAndExaactArgumentsBothOutputAsAnyTypeAndExactInMessageAnyTyoeInNotExpectedMessage(Type: new (...args: Array<any>) => Object, exactValue: any) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, false, [ Any(Type), exactValue ]);

      Expect(functionCallError.message).toBe("Expected function not to be called with [Any " + (<any>Type).name + ", " + JSON.stringify(exactValue) + "].");
   }

   @TestCase(Number, "test")
   @TestCase(String, 42)
   @TestCase(Object, "something else")
   @TestCase(Array, -42)
   public anyTypeAndExactArgumentsBothOutputAsAnyTypeAndExactInExpectedValue(Type: new (...args: Array<any>) => Object, exactValue: any) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, true, [ Any(Type), exactValue ]);

      Expect(functionCallError.expected).toBe("function to be called with [Any " + (<any>Type).name + ", " + JSON.stringify(exactValue) + "].");
   }

   @TestCase(Number, "test")
   @TestCase(String, 42)
   @TestCase(Object, "something else")
   @TestCase(Array, -42)
   public anyTypeAndExactArgumentsBothOutputAsAnyTypeAndExactInNotExpectedValue(Type: new (...args: Array<any>) => Object, exactValue: any) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, false, [ Any(Type), exactValue ]);

      Expect(functionCallError.expected).toBe("function not to be called with [Any " + (<any>Type).name + ", " + JSON.stringify(exactValue) + "].");
   }
}
