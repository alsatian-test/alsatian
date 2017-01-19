import { Any, Expect, Test, TestCase } from "../../../core/alsatian-core";
import { FunctionCallCountMatchError } from "../../../core/errors/function-call-count-match-error";
import { SpyCallCountType } from "../../../core/matchers";

export class FunctionCallCountMatchErrorTests {

   @TestCase(1)
   @TestCase(2)
   @TestCase(42)
   public shouldBeCalledMessage(callCount: number) {
      let fakeFunction: any = { calls: [ ] };

      let error = new FunctionCallCountMatchError(fakeFunction, true, callCount, SpyCallCountType.Exactly);

      if (callCount === 1) {
        Expect(error.message).toBe("Expected function to be called 1 time.");
      }
      else {
        Expect(error.message).toBe("Expected function to be called " + callCount + " times.");
      }
   }

   @TestCase(1)
   @TestCase(2)
   @TestCase(42)
   public shouldNotBeCalledMessage(callCount: number) {
      let fakeFunction: any = { calls: [ ] };

      fakeFunction.calls.push({ args: [] });

      let error = new FunctionCallCountMatchError(fakeFunction, false, callCount, SpyCallCountType.Exactly);

      if (callCount === 1) {
        Expect(error.message).toBe("Expected function not to be called 1 time.");
      }
      else {
        Expect(error.message).toBe("Expected function not to be called " + callCount + " times.");
      }
   }

   @TestCase(1)
   @TestCase(2)
   @TestCase(42)
   public shouldBeCalledGreaterThanMessage(callCount: number) {
      let fakeFunction: any = { calls: [ ] };

      let error = new FunctionCallCountMatchError(fakeFunction, true, callCount, SpyCallCountType.GreaterThan);

      if (callCount === 1) {
        Expect(error.message).toBe("Expected function to be called greater than 1 time.");
      }
      else {
        Expect(error.message).toBe("Expected function to be called greater than " + callCount + " times.");
      }
   }

   @TestCase(1)
   @TestCase(2)
   @TestCase(42)
   public shouldBeCalledLessThanMessage(callCount: number) {
      let fakeFunction: any = { calls: [ ] };

      let error = new FunctionCallCountMatchError(fakeFunction, true, callCount, SpyCallCountType.LessThan);

      if (callCount === 1) {
        Expect(error.message).toBe("Expected function to be called less than 1 time.");
      }
      else {
        Expect(error.message).toBe("Expected function to be called less than " + callCount + " times.");
      }
   }

   @TestCase(1)
   @TestCase(2)
   @TestCase(42)
   public actualValueAndShouldNotMatchShouldBeSetToFunctionWasCalled(callCount: number) {
      let fakeFunction: any = { calls: [ ] };

      for (let i = 0; i < callCount; i++) {
        fakeFunction.calls.push({ args: [] });
      }

      let error = new FunctionCallCountMatchError(fakeFunction, false, 100, SpyCallCountType.Exactly);

      if (callCount === 1) {
        Expect(error.actual).toBe("function was called 1 time.");
      }
      else {
        Expect(error.actual).toBe("function was called " + callCount + " times.");
      }
   }

   @TestCase(1)
   @TestCase(2)
   @TestCase(42)
   public expectedValueAndShouldMatchShouldBeSetToFunctionToBeCalled(callCount: number) {

      let fakeFunction: any = { calls: [ ] };

      let error = new FunctionCallCountMatchError(fakeFunction, true, callCount, SpyCallCountType.Exactly);

      if (callCount === 1) {
        Expect(error.message).toBe("Expected function to be called 1 time.");
      }
      else {
        Expect(error.message).toBe("Expected function to be called " + callCount + " times.");
      }
   }

   @TestCase(1)
   @TestCase(2)
   @TestCase(42)
   public expectedValueAndShouldNotMatchShouldBeSetToFunctionNotToBeCalled(callCount: number) {
      let fakeFunction: any = { calls: [ ] };

      fakeFunction.calls.push({ args: [] });

      let error = new FunctionCallCountMatchError(fakeFunction, false, callCount, SpyCallCountType.Exactly);

      if (callCount === 1) {
        Expect(error.message).toBe("Expected function not to be called 1 time.");
      }
      else {
        Expect(error.message).toBe("Expected function not to be called " + callCount + " times.");
      }
   }

   @TestCase(1)
   @TestCase(2)
   @TestCase(42)
   public expectedValueAndShouldMatchGreaterThanShouldBeSetToFunctionToBeCalled(callCount: number) {

      let fakeFunction: any = { calls: [ ] };

      let error = new FunctionCallCountMatchError(fakeFunction, true, callCount, SpyCallCountType.GreaterThan);

      if (callCount === 1) {
        Expect(error.message).toBe("Expected function to be called greater than 1 time.");
      }
      else {
        Expect(error.message).toBe("Expected function to be called greater than " + callCount + " times.");
      }
   }

   @TestCase(1)
   @TestCase(2)
   @TestCase(42)
   public expectedValueAndShouldMatchLessThanShouldBeSetToFunctionToBeCalled(callCount: number) {

      let fakeFunction: any = { calls: [ ] };

      let error = new FunctionCallCountMatchError(fakeFunction, true, callCount, SpyCallCountType.LessThan);

      if (callCount === 1) {
        Expect(error.message).toBe("Expected function to be called less than 1 time.");
      }
      else {
        Expect(error.message).toBe("Expected function to be called less than " + callCount + " times.");
      }
   }

   @TestCase([ "this" ])
   @TestCase([ "this", "that" ])
   @TestCase([ 1, 2, 3 ])
   public shouldBeCalledWithArgsMessage(args: Array<any>) {
      let fakeFunction: any = { calls: [ ] };

      fakeFunction.calls.push({ args: [] });

      let error = new FunctionCallCountMatchError(fakeFunction, true, 1, SpyCallCountType.Exactly, args);

      Expect(error.message)
        .toBe("Expected function to be called with [" + args.map(arg => JSON.stringify(arg)).join(", ") + "] 1 time.");
   }

   @TestCase([ "this" ])
   @TestCase([ "this", "that" ])
   @TestCase([ 1, 2, 3 ])
   public shouldNotBeCalledWithArgsMessage(expectedArguments: Array<any>) {
      let fakeFunction: any = { calls: [ ] };

      fakeFunction.calls.push({ args: expectedArguments });

      let error = new FunctionCallCountMatchError(fakeFunction, false, 1, SpyCallCountType.Exactly, expectedArguments);

      Expect(error.message)
        .toBe(`Expected function not to be called with ` +
              `[${expectedArguments.map(arg => JSON.stringify(arg)).join(", ")}] 1 time.`);
   }

   @TestCase([ "this" ])
   @TestCase([ "this", "that" ])
   @TestCase([ 1, 2, 3 ])
   public shouldBeCalledGreaterThanWithArgsMessage(args: Array<any>) {
      let fakeFunction: any = { calls: [ ] };

      fakeFunction.calls.push({ args: [] });

      let error = new FunctionCallCountMatchError(fakeFunction, true, 1, SpyCallCountType.GreaterThan, args);

      Expect(error.message)
        .toBe("Expected function to be called " +
              "with [" + args.map(arg => JSON.stringify(arg)).join(", ") + "] greater than 1 time.");
   }

   @TestCase([ "this" ])
   @TestCase([ "this", "that" ])
   @TestCase([ 1, 2, 3 ])
   public shouldBeCalledLessThanWithArgsMessage(expectedArguments: Array<any>) {
      let fakeFunction: any = { calls: [ ] };

      fakeFunction.calls.push({ args: expectedArguments });

      let error = new FunctionCallCountMatchError(fakeFunction, true, 1, SpyCallCountType.LessThan, expectedArguments);

      Expect(error.message)
        .toBe(`Expected function not to be called with ` +
              `[${expectedArguments.map(arg => JSON.stringify(arg)).join(", ")}] less than 1 time.`);
   }

   @TestCase([[]])
   @TestCase([[], []])
   @TestCase([[1], [2], [3]])
   @TestCase([["something", "and", "another", "thing"]])
   @TestCase([["this", "or"], ["that", "other", "thing"]])
   public actualValueAndShouldMatchShouldBeSetToFunctionWasNotCalledWithArguments(
                                                                  actualArgumentsList: Array<Array<any>>) {
      let fakeFunction: any = { calls: [ ] };

      actualArgumentsList.forEach(actualArguments => {
         fakeFunction.calls.push({ args: actualArguments });
      });

      let error = new FunctionCallCountMatchError(fakeFunction, true, 1, SpyCallCountType.Exactly, []);

      Expect(error.actual)
        .toBe("function was called " +
              "with " + actualArgumentsList.map(args => JSON.stringify(args)).join(", ") +
              " " + actualArgumentsList.length + " time" + (actualArgumentsList.length !== 1 ? "s" : "") + ".");
   }

   @TestCase([[]])
   @TestCase([[], []])
   @TestCase([[1], [2], [3]])
   @TestCase([["something", "and", "another", "thing"]])
   @TestCase([["this", "or"], ["that", "other", "thing"]])
   public actualValueAndShouldNotMatchShouldBeSetToFunctionWasCalledWithArguments(
                                                                      actualArgumentsList: Array<Array<any>>) {
      let fakeFunction: any = { calls: [ ] };

      actualArgumentsList.forEach(actualArguments => {
         fakeFunction.calls.push({ args: actualArguments });
      });

      let error = new FunctionCallCountMatchError(fakeFunction, false, 1, SpyCallCountType.Exactly, []);

      Expect(error.actual)
        .toBe("function was called " +
              "with " + actualArgumentsList.map(args => JSON.stringify(args)).join(", ") +
              " " +  actualArgumentsList.length + " time" + (actualArgumentsList.length !== 1 ? "s" : "") + ".");
   }

   @TestCase([[]])
   @TestCase([[], []])
   @TestCase([[1], [2], [3]])
   @TestCase([["something", "and", "another", "thing"]])
   @TestCase([["this", "or"], ["that", "other", "thing"]])
   public actualValueAndShouldMatchGreaterThanShouldBeSetToFunctionWasNotCalledWithArguments(
                                                                    actualArgumentsList: Array<Array<any>>) {
      let fakeFunction: any = { calls: [ ] };

      actualArgumentsList.forEach(actualArguments => {
         fakeFunction.calls.push({ args: actualArguments });
      });

      let error = new FunctionCallCountMatchError(fakeFunction, true, 1, SpyCallCountType.GreaterThan, []);

      Expect(error.actual)
        .toBe("function was called " +
              "with " + actualArgumentsList.map(args => JSON.stringify(args)).join(", ") +
              " " + actualArgumentsList.length + " time" + (actualArgumentsList.length !== 1 ? "s" : "") + ".");
   }

   @TestCase([[]])
   @TestCase([[], []])
   @TestCase([[1], [2], [3]])
   @TestCase([["something", "and", "another", "thing"]])
   @TestCase([["this", "or"], ["that", "other", "thing"]])
   public actualValueAndShouldMatchLessThanShouldBeSetToFunctionWasNotCalledWithArguments(
                                                                        actualArgumentsList: Array<Array<any>>) {
      let fakeFunction: any = { calls: [ ] };

      actualArgumentsList.forEach(actualArguments => {
         fakeFunction.calls.push({ args: actualArguments });
      });

      let error = new FunctionCallCountMatchError(fakeFunction, true, 1, SpyCallCountType.GreaterThan, []);

      Expect(error.actual)
        .toBe("function was called " +
              "with " + actualArgumentsList.map(args => JSON.stringify(args)).join(", ") +
              " " + actualArgumentsList.length + " time" + (actualArgumentsList.length !== 1 ? "s" : "") + ".");
   }

   @TestCase([])
   @TestCase([1])
   @TestCase(["something"])
   @TestCase([1, "or", 2, "other", "things"])
   public expectedValueAndShouldMatchShouldBeSetToFunctionToBeCalledWithArguments(expectedArguments: Array<any>) {
      let fakeFunction: any = { calls: [ ] };

      let error = new FunctionCallCountMatchError(fakeFunction, true, 1, SpyCallCountType.Exactly, expectedArguments);

      Expect(error.expected)
        .toBe("function to be called with " + JSON.stringify(expectedArguments).replace(/,/g, ", ") + " 1 time.");
   }

   @TestCase([])
   @TestCase([1])
   @TestCase(["something"])
   @TestCase([1, "or", 2, "other", "things"])
   public expectedValueAndShouldNotMatchShouldBeSetToFunctionNotToBeCalledWithArguments(
                                                                              expectedArguments: Array<any>) {
      let fakeFunction: any = { calls: [ ] };

      fakeFunction.calls.push({ args: expectedArguments });

      let error = new FunctionCallCountMatchError(fakeFunction, false, 1, SpyCallCountType.Exactly, expectedArguments);

      Expect(error.expected)
        .toBe("function not to be called with " + JSON.stringify(expectedArguments).replace(/,/g, ", ") + " 1 time.");
   }

   @Test()
   public anyArgumentOutputAsAnythingInMessage() {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallCountMatchError(fakeSpy, true, 1, SpyCallCountType.Exactly, [ Any ]);

      Expect(functionCallError.message).toBe("Expected function to be called with [Anything] 1 time.");
   }

   @Test()
   public twoAnyArgumentsBothOutputAsAnythingInMessage() {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallCountMatchError(fakeSpy,
                                                                true,
                                                                1,
                                                                SpyCallCountType.Exactly,
                                                                [ Any, Any ]);

      Expect(functionCallError.message).toBe("Expected function to be called with [Anything, Anything] 1 time.");
   }

   @Test()
   public anyArgumentOutputAsAnythingInNotExpectedMessage() {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallCountMatchError(fakeSpy, false, 1, SpyCallCountType.Exactly, [ Any ]);

      Expect(functionCallError.message).toBe("Expected function not to be called with [Anything] 1 time.");
   }

   @Test()
   public twoAnyArgumentsBothOutputAsAnythingInNotExpectedMessage() {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallCountMatchError(fakeSpy,
                                                                false,
                                                                1,
                                                                SpyCallCountType.Exactly,
                                                                [ Any, Any ]);

      Expect(functionCallError.message).toBe("Expected function not to be called with [Anything, Anything] 1 time.");
   }

   @Test()
   public anyArgumentOutputAsAnythingInGreaterThanMessage() {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallCountMatchError(fakeSpy,
                                                                true,
                                                                1,
                                                                SpyCallCountType.GreaterThan,
                                                                [ Any ]);

      Expect(functionCallError.message).toBe("Expected function to be called with [Anything] greater than 1 time.");
   }

   @Test()
   public twoAnyArgumentsBothOutputAsAnythingInGreaterThanMessage() {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallCountMatchError(fakeSpy,
                                                                true,
                                                                1,
                                                                SpyCallCountType.GreaterThan,
                                                                [ Any, Any ]);

      Expect(functionCallError.message)
        .toBe("Expected function to be called with [Anything, Anything] greater than 1 time.");
   }

   @Test()
   public anyArgumentOutputAsAnythingInLessThanMessage() {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallCountMatchError(fakeSpy, true, 1, SpyCallCountType.LessThan, [ Any ]);

      Expect(functionCallError.message).toBe("Expected function to be called with [Anything] less than 1 time.");
   }

   @Test()
   public twoAnyArgumentsBothOutputAsAnythingInLessThanMessage() {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallCountMatchError(fakeSpy,
                                                                true,
                                                                1,
                                                                SpyCallCountType.LessThan,
                                                                [ Any, Any ]);

      Expect(functionCallError.message)
        .toBe("Expected function to be called with [Anything, Anything] less than 1 time.");
   }

   @Test()
   public anyArgumentOutputAsAnythingInExpectedValue() {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallCountMatchError(fakeSpy,
                                                                true,
                                                                1,
                                                                SpyCallCountType.Exactly,
                                                                [ Any ]);

      Expect(functionCallError.expected).toBe("function to be called with [Anything] 1 time.");
   }

   @Test()
   public twoAnyArgumentsBothOutputAsAnythingInExpectedValue() {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallCountMatchError(fakeSpy,
                                                                true,
                                                                1,
                                                                SpyCallCountType.Exactly,
                                                                [ Any, Any ]);

      Expect(functionCallError.expected).toBe("function to be called with [Anything, Anything] 1 time.");
   }

   @Test()
   public anyArgumentOutputAsAnythingInNotExpectedValue() {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallCountMatchError(fakeSpy,
                                                                false,
                                                                1,
                                                                SpyCallCountType.Exactly,
                                                                [ Any ]);

      Expect(functionCallError.expected).toBe("function not to be called with [Anything] 1 time.");
   }

   @Test()
   public twoAnyArgumentsBothOutputAsAnythingInNotExpectedValue() {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallCountMatchError(fakeSpy,
                                                                false,
                                                                1,
                                                                SpyCallCountType.Exactly,
                                                                [ Any, Any ]);

      Expect(functionCallError.expected).toBe("function not to be called with [Anything, Anything] 1 time.");
   }

   @Test()
   public anyArgumentOutputAsAnythingInGreaterThanExpectedValue() {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallCountMatchError(fakeSpy,
                                                                true,
                                                                1,
                                                                SpyCallCountType.GreaterThan,
                                                                [ Any ]);

      Expect(functionCallError.expected).toBe("function to be called with [Anything] greater than 1 time.");
   }

   @Test()
   public twoAnyArgumentsBothOutputAsAnythingInGreaterThanExpectedValue() {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallCountMatchError(fakeSpy,
                                                                true,
                                                                1,
                                                                SpyCallCountType.GreaterThan,
                                                                [ Any, Any ]);

      Expect(functionCallError.expected).toBe("function to be called with [Anything, Anything] greater than 1 time.");
   }

   @Test()
   public anyArgumentOutputAsAnythingInLessThanExpectedValue() {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallCountMatchError(fakeSpy, true, 1, SpyCallCountType.LessThan, [ Any ]);

      Expect(functionCallError.expected).toBe("function to be called with [Anything] less than 1 time.");
   }

   @Test()
   public twoAnyArgumentsBothOutputAsAnythingInLessThanExpectedValue() {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallCountMatchError(fakeSpy,
                                                                true,
                                                                1,
                                                                SpyCallCountType.LessThan,
                                                                [ Any, Any ]);

      Expect(functionCallError.expected).toBe("function to be called with [Anything, Anything] less than 1 time.");
   }

   @TestCase(Number)
   @TestCase(String)
   @TestCase(Object)
   @TestCase(Array)
   public anyTypeArgumentOutputAsAnyTypeInMessage(type: new (...args: Array<any>) => Object) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallCountMatchError(fakeSpy,
                                                                true,
                                                                1,
                                                                SpyCallCountType.Exactly,
                                                                [ Any(type) ]);

      Expect(functionCallError.message)
        .toBe("Expected function to be called with [Any " + (<any> type).name + "] 1 time.");
   }

   @TestCase(Number, Array)
   @TestCase(String, Object)
   @TestCase(Object, String)
   @TestCase(Array, Number)
   public twoAnyTypeArgumentsBothOutputAsAnyTypeInMessage(
                                                          typeOne: new (...args: Array<any>) => Object,
                                                          typeTwo: new (...args: Array<any>) => Object) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallCountMatchError(fakeSpy,
                                                                true,
                                                                1,
                                                                SpyCallCountType.Exactly,
                                                                [ Any(typeOne), Any(typeTwo) ]);

      Expect(functionCallError.message)
        .toBe("Expected function to be called " +
              "with [Any " + (<any> typeOne).name + ", Any " + (<any> typeTwo).name + "] 1 time.");
   }

   @TestCase(Number)
   @TestCase(String)
   @TestCase(Object)
   @TestCase(Array)
   public anyTypeArgumentOutputAsAnyTypeInNotExpectedMessage(type: new (...args: Array<any>) => Object) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallCountMatchError(fakeSpy,
                                                                false,
                                                                1,
                                                                SpyCallCountType.Exactly,
                                                                [ Any(type) ]);

      Expect(functionCallError.message)
        .toBe("Expected function not to be called with [Any " + (<any> type).name + "] 1 time.");
   }

   @TestCase(Number, Array)
   @TestCase(String, Object)
   @TestCase(Object, String)
   @TestCase(Array, Number)
   public twoAnyTypeArgumentsBothOutputAsAnyTyoeInNotExpectedMessage(
                                                          typeOne: new (...args: Array<any>) => Object,
                                                          typeTwo: new (...args: Array<any>) => Object) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallCountMatchError(fakeSpy,
                                                                false,
                                                                1,
                                                                SpyCallCountType.Exactly,
                                                                [ Any(typeOne), Any(typeTwo) ]);

      Expect(functionCallError.message)
        .toBe("Expected function not to be called " +
              "with [Any " + (<any> typeOne).name + ", Any " + (<any> typeTwo).name + "] 1 time.");
   }

   @TestCase(Number)
   @TestCase(String)
   @TestCase(Object)
   @TestCase(Array)
   public anyTypeArgumentOutputAsAnyTypeInGreaterThanMessage(type: new (...args: Array<any>) => Object) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallCountMatchError(fakeSpy,
                                                                true,
                                                                1,
                                                                SpyCallCountType.GreaterThan,
                                                                [ Any(type) ]);

      Expect(functionCallError.message)
        .toBe("Expected function to be called with [Any " + (<any> type).name + "] greater than 1 time.");
   }

   @TestCase(Number, Array)
   @TestCase(String, Object)
   @TestCase(Object, String)
   @TestCase(Array, Number)
   public twoAnyTypeArgumentsBothOutputAsAnyTypeInGreaterThanMessage(
                                                            typeOne: new (...args: Array<any>) => Object,
                                                            typeTwo: new (...args: Array<any>) => Object) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallCountMatchError(fakeSpy,
                                                                true,
                                                                1,
                                                                SpyCallCountType.GreaterThan,
                                                                [ Any(typeOne), Any(typeTwo) ]);

      Expect(functionCallError.message)
        .toBe("Expected function to be called " +
              "with [Any " + (<any> typeOne).name + ", Any " + (<any> typeTwo).name + "] greater than 1 time.");
   }

   @TestCase(Number)
   @TestCase(String)
   @TestCase(Object)
   @TestCase(Array)
   public anyTypeArgumentOutputAsAnyTypeInLessThanMessage(type: new (...args: Array<any>) => Object) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallCountMatchError(fakeSpy,
                                                                true,
                                                                1,
                                                                SpyCallCountType.LessThan,
                                                                [ Any(type) ]);

      Expect(functionCallError.message)
        .toBe("Expected function to be called with [Any " + (<any> type).name + "] less than 1 time.");
   }

   @TestCase(Number, Array)
   @TestCase(String, Object)
   @TestCase(Object, String)
   @TestCase(Array, Number)
   public twoAnyTypeArgumentsBothOutputAsAnyTypeInLessThanMessage(
                                                  typeOne: new (...args: Array<any>) => Object,
                                                  typeTwo: new (...args: Array<any>) => Object) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallCountMatchError(fakeSpy,
                                                                true,
                                                                1,
                                                                SpyCallCountType.LessThan,
                                                                [ Any(typeOne), Any(typeTwo) ]);

      Expect(functionCallError.message)
        .toBe("Expected function to be called " +
              "with [Any " + (<any> typeOne).name + ", Any " + (<any> typeTwo).name + "] less than 1 time.");
   }

   @TestCase(Number)
   @TestCase(String)
   @TestCase(Object)
   @TestCase(Array)
   public anyTypeArgumentOutputAsAnyTypeInExpectedValue(type: new (...args: Array<any>) => Object) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallCountMatchError(fakeSpy,
                                                                true,
                                                                1,
                                                                SpyCallCountType.Exactly,
                                                                [ Any(type) ]);

      Expect(functionCallError.expected).toBe("function to be called with [Any " + (<any> type).name +  "] 1 time.");
   }

   @TestCase(Number, Array)
   @TestCase(String, Object)
   @TestCase(Object, String)
   @TestCase(Array, Number)
   public twoAnyTypeArgumentsBothOutputAsAnyTypeInExpectedValue(
                                                    typeOne: new (...args: Array<any>) => Object,
                                                    typeTwo: new (...args: Array<any>) => Object) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallCountMatchError(fakeSpy,
                                                                true,
                                                                1,
                                                                SpyCallCountType.Exactly,
                                                                [ Any(typeOne), Any(typeTwo) ]);

      Expect(functionCallError.expected)
        .toBe(`function to be called with [Any ${(<any> typeOne).name}, Any ${(<any> typeTwo).name}] 1 time.`);
   }

   @TestCase(Number)
   @TestCase(String)
   @TestCase(Object)
   @TestCase(Array)
   public anyTypeArgumentOutputAsAnyTypeInNotExpectedValue(type: new (...args: Array<any>) => Object) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallCountMatchError(fakeSpy,
                                                                false,
                                                                1,
                                                                SpyCallCountType.Exactly,
                                                                [ Any(type) ]);

      Expect(functionCallError.expected)
        .toBe(`function not to be called with [Any ${(<any> type).name}] 1 time.`);
   }

   @TestCase(Number, Array)
   @TestCase(String, Object)
   @TestCase(Object, String)
   @TestCase(Array, Number)
   public twoAnyTypeArgumentsBothOutputAsAnyTypeInNotExpectedValue(
                                                typeOne: new (...args: Array<any>) => Object,
                                                typeTwo: new (...args: Array<any>) => Object) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallCountMatchError(fakeSpy,
                                                                false,
                                                                1,
                                                                SpyCallCountType.Exactly,
                                                                [ Any(typeOne), Any(typeTwo) ]);

      Expect(functionCallError.expected)
        .toBe(`function not to be called with [Any ${(<any> typeOne).name}, Any ${(<any> typeTwo).name}1 time.`);
   }

   @TestCase(Number)
   @TestCase(String)
   @TestCase(Object)
   @TestCase(Array)
   public anyAndAnyTypeArgumentsBothOutputAsAnythingAndAnyTypeInMessage(type: new (...args: Array<any>) => Object) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallCountMatchError(fakeSpy,
                                                                true,
                                                                1,
                                                                SpyCallCountType.Exactly,
                                                                [ Any, Any(type) ]);

      Expect(functionCallError.message)
        .toBe("Expected function to be called with [Anything, Any " + (<any> type).name + "] 1 time.");
   }

   @TestCase(Number)
   @TestCase(String)
   @TestCase(Object)
   @TestCase(Array)
   public anyAndAnyTypeArgumentsBothOutputAsAnythingAndAnyTypeInMessageAnyTyoeInNotExpectedMessage(
                                                                        type: new (...args: Array<any>) => Object) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallCountMatchError(fakeSpy,
                                                                false,
                                                                1,
                                                                SpyCallCountType.Exactly,
                                                                [ Any, Any(type) ]);

      Expect(functionCallError.message)
        .toBe("Expected function not to be called with [Anything, Any " + (<any> type).name + "] 1 time.");
   }

   @TestCase(Number)
   @TestCase(String)
   @TestCase(Object)
   @TestCase(Array)
   public anyAndAnyTypeArgumentsBothOutputAsAnythingAndAnyTypeInExpectedValue(
                                                        type: new (...args: Array<any>) => Object) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallCountMatchError(fakeSpy,
                                                                true,
                                                                1,
                                                                SpyCallCountType.Exactly,
                                                                [ Any, Any(type) ]);

      Expect(functionCallError.expected)
        .toBe("function to be called with [Anything, Any " + (<any> type).name + "] 1 time.");
   }

   @TestCase(Number)
   @TestCase(String)
   @TestCase(Object)
   @TestCase(Array)
   public anyAndAnyTypeArgumentsBothOutputAsAnythignAndAnyTypeInNotExpectedValue(
                                                        type: new (...args: Array<any>) => Object) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallCountMatchError(fakeSpy,
                                                                false,
                                                                1,
                                                                SpyCallCountType.Exactly,
                                                                [ Any, Any(type) ]);

      Expect(functionCallError.expected)
        .toBe("function not to be called with [Anything, Any " + (<any> type).name + "] 1 time.");
   }

   @TestCase(Number)
   @TestCase(String)
   @TestCase(Object)
   @TestCase(Array)
   public anyTypeAndAnyArgumentsBothOutputAsAnyTypeAndAnythingInMessage(type: new (...args: Array<any>) => Object) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallCountMatchError(fakeSpy,
                                                                true,
                                                                1,
                                                                SpyCallCountType.Exactly,
                                                                [ Any(type), Any ]);

      Expect(functionCallError.message)
        .toBe("Expected function to be called with [Any " + (<any> type).name + ", Anything] 1 time.");
   }

   @TestCase(Number)
   @TestCase(String)
   @TestCase(Object)
   @TestCase(Array)
   public anyTypeAndAnyArgumentsBothOutputAsAnyTypeAndAnythingInMessageAnyTyoeInNotExpectedMessage(
                                                                      type: new (...args: Array<any>) => Object) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallCountMatchError(fakeSpy,
                                                                false,
                                                                1,
                                                                SpyCallCountType.Exactly,
                                                                [ Any(type), Any ]);

      Expect(functionCallError.message)
        .toBe("Expected function not to be called with [Any " + (<any> type).name + ", Anything] 1 time.");
   }

   @TestCase(Number)
   @TestCase(String)
   @TestCase(Object)
   @TestCase(Array)
   public anyTypeAndAnyArgumentsBothOutputAsAnyTypeAndAnythingInExpectedValue(
                                                              type: new (...args: Array<any>) => Object) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallCountMatchError(fakeSpy,
                                                                true,
                                                                1,
                                                                SpyCallCountType.Exactly,
                                                                [ Any(type), Any ]);

      Expect(functionCallError.expected)
        .toBe("function to be called with [Any " + (<any> type).name + ", Anything] 1 time.");
   }

   @TestCase(Number)
   @TestCase(String)
   @TestCase(Object)
   @TestCase(Array)
   public anyTypeAndAnyArgumentsBothOutputAsAnyTypeAndAnythingInNotExpectedValue(
                                                            type: new (...args: Array<any>) => Object) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallCountMatchError(fakeSpy,
                                                                false,
                                                                1,
                                                                SpyCallCountType.Exactly,
                                                                [ Any(type), Any ]);

      Expect(functionCallError.expected)
        .toBe("function not to be called with [Any " + (<any> type).name + ", Anything] 1 time.");
   }

   @TestCase("test")
   @TestCase(42)
   @TestCase("something else")
   @TestCase(-42)
   public exactAndAnyArgumentsBothOutputAsExactAndAnythingInMessage(exactValue: any) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallCountMatchError(fakeSpy,
                                                                true,
                                                                1,
                                                                SpyCallCountType.Exactly,
                                                                [ exactValue, Any]);

      Expect(functionCallError.message)
        .toBe("Expected function to be called with [" + JSON.stringify(exactValue) + ", Anything] 1 time.");
   }

   @TestCase("test")
   @TestCase(42)
   @TestCase("something else")
   @TestCase(-42)
   public exactAndAnyArgumentsBothOutputAsExactAndAnythingInMessageAnyTyoeInNotExpectedMessage(exactValue: any) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallCountMatchError(fakeSpy,
                                                                false,
                                                                1,
                                                                SpyCallCountType.Exactly,
                                                                [ exactValue, Any]);

      Expect(functionCallError.message)
        .toBe("Expected function not to be called with [" + JSON.stringify(exactValue) + ", Anything] 1 time.");
   }

   @TestCase("test")
   @TestCase(42)
   @TestCase("something else")
   @TestCase(-42)
   public exactAndAnyArgumentsBothOutputAsExactAndAnythingInExpectedValue(exactValue: any) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallCountMatchError(fakeSpy,
                                                                true,
                                                                1,
                                                                SpyCallCountType.Exactly,
                                                                [ exactValue, Any]);

      Expect(functionCallError.expected)
        .toBe("function to be called with [" + JSON.stringify(exactValue) + ", Anything] 1 time.");
   }

   @TestCase("test")
   @TestCase(42)
   @TestCase("something else")
   @TestCase(-42)
   public exactAndAnyArgumentsBothOutputAsExactAndAnythingInNotExpectedValue(exactValue: any) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallCountMatchError(fakeSpy,
                                                                false,
                                                                1,
                                                                SpyCallCountType.Exactly,
                                                                [ exactValue, Any]);

      Expect(functionCallError.expected)
        .toBe("function not to be called with [" + JSON.stringify(exactValue) + ", Anything] 1 time.");
   }

   @TestCase("test")
   @TestCase(42)
   @TestCase("something else")
   @TestCase(-42)
   public anyAndExactArgumentsBothOutputAsAnythingAndExactInMessage(exactValue: any) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallCountMatchError(fakeSpy,
                                                                true,
                                                                1,
                                                                SpyCallCountType.Exactly,
                                                                [ Any, exactValue ]);

      Expect(functionCallError.message)
        .toBe("Expected function to be called with [Anything, " + JSON.stringify(exactValue) + "] 1 time.");
   }

   @TestCase("test")
   @TestCase(42)
   @TestCase("something else")
   @TestCase(-42)
   public anyAndExaactArgumentsBothOutputAsAnythingAndExactInMessageAnyTyoeInNotExpectedMessage( exactValue: any) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallCountMatchError(fakeSpy,
                                                                false,
                                                                1,
                                                                SpyCallCountType.Exactly,
                                                                [ Any, exactValue ]);

      Expect(functionCallError.message)
        .toBe("Expected function not to be called with [Anything, " + JSON.stringify(exactValue) + "] 1 time.");
   }

   @TestCase("test")
   @TestCase(42)
   @TestCase("something else")
   @TestCase(-42)
   public anyAndExactArgumentsBothOutputAsAnythingAndExactInExpectedValue(exactValue: any) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallCountMatchError(fakeSpy,
                                                                true,
                                                                1,
                                                                SpyCallCountType.Exactly,
                                                                [ Any, exactValue ]);

      Expect(functionCallError.expected)
        .toBe("function to be called with [Anything, " + JSON.stringify(exactValue) + "] 1 time.");
   }

   @TestCase("test")
   @TestCase(42)
   @TestCase("something else")
   @TestCase(-42)
   public anyAndExactArgumentsBothOutputAsAnythingAndExactInNotExpectedValue(exactValue: any) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallCountMatchError(fakeSpy,
                                                                false,
                                                                1,
                                                                SpyCallCountType.Exactly,
                                                                [ Any, exactValue ]);

      Expect(functionCallError.expected)
        .toBe("function not to be called with [Anything, " + JSON.stringify(exactValue) + "] 1 time.");
   }

   @TestCase(Number, "test")
   @TestCase(String, 42)
   @TestCase(Object, "something else")
   @TestCase(Array, -42)
   public exactAndAnyTypeArgumentsBothOutputAsExactAndAnyTypeInMessage(
                                                    type: new (...args: Array<any>) => Object,
                                                    exactValue: any) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallCountMatchError(fakeSpy,
                                                                true,
                                                                1,
                                                                SpyCallCountType.Exactly,
                                                                [ exactValue, Any(type) ]);

      Expect(functionCallError.message)
        .toBe("Expected function to be called " +
              "with [" + JSON.stringify(exactValue) + ", Any " + (<any> type).name + "] 1 time.");
   }

   @TestCase(Number, "test")
   @TestCase(String, 42)
   @TestCase(Object, "something else")
   @TestCase(Array, -42)
   public exactAndAnyTypeArgumentsBothOutputAsExactAndAnyTypeInMessageAnyTyoeInNotExpectedMessage(
                                                                          type: new (...args: Array<any>) => Object,
                                                                          exactValue: any) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallCountMatchError(fakeSpy,
                                                                false,
                                                                1,
                                                                SpyCallCountType.Exactly,
                                                                [ exactValue, Any(type) ]);

      Expect(functionCallError.message)
        .toBe("Expected function not to be called " +
              "with [" + JSON.stringify(exactValue) + ", Any " + (<any> type).name + "] 1 time.");
   }

   @TestCase(Number, "test")
   @TestCase(String, 42)
   @TestCase(Object, "something else")
   @TestCase(Array, -42)
   public exactAndAnyTypeArgumentsBothOutputAsExactAndAnyTypeInExpectedValue(
                                                                  type: new (...args: Array<any>) => Object,
                                                                  exactValue: any) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallCountMatchError(fakeSpy,
                                                                true,
                                                                1,
                                                                SpyCallCountType.Exactly,
                                                                [ exactValue, Any(type) ]);

      Expect(functionCallError.expected)
        .toBe(`function to be called with [${JSON.stringify(exactValue)}, Any ${(<any> type).name}] 1 time.`);
   }

   @TestCase(Number, "test")
   @TestCase(String, 42)
   @TestCase(Object, "something else")
   @TestCase(Array, -42)
   public exactAndAnyTypeArgumentsBothOutputAsExactAndAnyTypeInNotExpectedValue(
                                                          type: new (...args: Array<any>) => Object,
                                                          exactValue: any) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallCountMatchError(fakeSpy,
                                                                false,
                                                                1,
                                                                SpyCallCountType.Exactly,
                                                                [ exactValue, Any(type) ]);

      Expect(functionCallError.expected)
        .toBe(`function not to be called with [${JSON.stringify(exactValue)}, Any ${(<any> type).name}] 1 time.`);
   }

   @TestCase(Number, "test")
   @TestCase(String, 42)
   @TestCase(Object, "something else")
   @TestCase(Array, -42)
   public anyTypeAndExactArgumentsBothOutputAsAnyTypeAndExactInMessage(
                                                                  type: new (...args: Array<any>) => Object,
                                                                  exactValue: any) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallCountMatchError(fakeSpy,
                                                                true,
                                                                1,
                                                                SpyCallCountType.Exactly,
                                                                [ Any(type), exactValue ]);

      Expect(functionCallError.message)
        .toBe(`Expected function to be called ` +
              `with [Any ${(<any> type).name}, ${JSON.stringify(exactValue)}] 1 time.`);
   }

   @TestCase(Number, "test")
   @TestCase(String, 42)
   @TestCase(Object, "something else")
   @TestCase(Array, -42)
   public anyTypeAndExaactArgumentsBothOutputAsAnyTypeAndExactInMessageAnyTyoeInNotExpectedMessage(
                                                                            type: new (...args: Array<any>) => Object,
                                                                            exactValue: any) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallCountMatchError(fakeSpy,
                                                                false,
                                                                1,
                                                                SpyCallCountType.Exactly,
                                                                [ Any(type), exactValue ]);

      Expect(functionCallError.message)
        .toBe(`Expected function not to be called ` +
              `with [Any ${(<any> type).name}, ${JSON.stringify(exactValue)}] 1 time.`);
   }

   @TestCase(Number, "test")
   @TestCase(String, 42)
   @TestCase(Object, "something else")
   @TestCase(Array, -42)
   public anyTypeAndExactArgumentsBothOutputAsAnyTypeAndExactInExpectedValue(
                                                                  type: new (...args: Array<any>) => Object,
                                                                  exactValue: any) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallCountMatchError(fakeSpy,
                                                                true,
                                                                1,
                                                                SpyCallCountType.Exactly,
                                                                [ Any(type), exactValue ]);

      Expect(functionCallError.expected)
        .toBe(`function to be called with [Any ${(<any> type).name}, ${JSON.stringify(exactValue)}] 1 time.`);
   }

   @TestCase(Number, "test")
   @TestCase(String, 42)
   @TestCase(Object, "something else")
   @TestCase(Array, -42)
   public anyTypeAndExactArgumentsBothOutputAsAnyTypeAndExactInNotExpectedValue(
                                                                  type: new (...args: Array<any>) => Object,
                                                                  exactValue: any) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallCountMatchError(fakeSpy,
                                                                false,
                                                                1,
                                                                SpyCallCountType.Exactly,
                                                                [ Any(type), exactValue ]);

      Expect(functionCallError.expected)
        .toBe(`function not to be called with [Any ${(<any> type).name}, ${JSON.stringify(exactValue)}] 1 time.`);
   }
}
