import { Any, Expect, Test, TestCase } from "../../../core/alsatian-core";
import { FunctionCallMatchError } from "../../../core/errors/function-call-match-error";

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

      Expect(error.message)
        .toBe("Expected function to be called with [" + args.map(arg => JSON.stringify(arg)).join(", ") + "].");
   }

   @TestCase([ "this" ])
   @TestCase([ "this", "that" ])
   @TestCase([ 1, 2, 3 ])
   public shouldNotBeCalledWithArgsMessage(expectedArguments: Array<any>) {
      let fakeFunction: any = { calls: [ ] };

      fakeFunction.calls.push({ args: expectedArguments });

      let error = new FunctionCallMatchError(fakeFunction, false, expectedArguments);

      Expect(error.message)
        .toBe("Expected function not to be called with " +
              "[" + expectedArguments.map(arg => JSON.stringify(arg)).join(", ") + "].");
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

      let error = new FunctionCallMatchError(fakeFunction, true, []);

      Expect(error.actual)
        .toBe("function was called with " + actualArgumentsList.map(args => JSON.stringify(args)).join(", ") + ".");
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

      let error = new FunctionCallMatchError(fakeFunction, false, []);

      Expect(error.actual)
        .toBe("function was called with " + actualArgumentsList.map(args => JSON.stringify(args)).join(", ") + ".");
   }

   @TestCase([])
   @TestCase([1])
   @TestCase(["something"])
   @TestCase([1, "or", 2, "other", "things"])
   public expectedValueAndShouldMatchShouldBeSetToFunctionToBeCalledWithArguments(expectedArguments: Array<any>) {
      let fakeFunction: any = { calls: [ ] };

      let error = new FunctionCallMatchError(fakeFunction, true, expectedArguments);

      Expect(error.expected)
        .toBe("function to be called with " + JSON.stringify(expectedArguments).replace(/,/g, ", ") + ".");
   }

   @TestCase([])
   @TestCase([1])
   @TestCase(["something"])
   @TestCase([1, "or", 2, "other", "things"])
   public expectedValueAndShouldNotMatchShouldBeSetToFunctionNotToBeCalledWithArguments(expectedArguments: Array<any>) {
      let fakeFunction: any = { calls: [ ] };

      fakeFunction.calls.push({ args: expectedArguments });

      let error = new FunctionCallMatchError(fakeFunction, false, expectedArguments);

      Expect(error.expected)
        .toBe("function not to be called with " + JSON.stringify(expectedArguments).replace(/,/g, ", ") + ".");
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
   public anyTypeArgumentOutputAsAnyTypeInMessage(type: new (...args: Array<any>) => Object) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, true, [ Any(type) ]);

      Expect(functionCallError.message).toBe("Expected function to be called with [Any " + (<any> type).name + "].");
   }

   @TestCase(Number, Array)
   @TestCase(String, Object)
   @TestCase(Object, String)
   @TestCase(Array, Number)
   public twoAnyTypeArgumentsBothOutputAsAnyTypeInMessage(
                                    typeOne: new (...args: Array<any>) => Object,
                                    typeTwo: new (...args: Array<any>) => Object) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, true, [ Any(typeOne), Any(typeTwo) ]);

      Expect(functionCallError.message)
        .toBe(`Expected function to be called with [Any ${(<any> typeOne).name}, Any ${(<any> typeTwo).name}].`);
   }

   @TestCase(Number)
   @TestCase(String)
   @TestCase(Object)
   @TestCase(Array)
   public anyTypeArgumentOutputAsAnyTypeInNotExpectedMessage(type: new (...args: Array<any>) => Object) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, false, [ Any(type) ]);

      Expect(functionCallError.message)
        .toBe("Expected function not to be called with [Any " + (<any> type).name + "].");
   }

   @TestCase(Number, Array)
   @TestCase(String, Object)
   @TestCase(Object, String)
   @TestCase(Array, Number)
   public twoAnyTypeArgumentsBothOutputAsAnyTypeInNotExpectedMessage(
                                            typeOne: new (...args: Array<any>) => Object,
                                            typeTwo: new (...args: Array<any>) => Object) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, false, [ Any(typeOne), Any(typeTwo) ]);

      Expect(functionCallError.message)
        .toBe(`Expected function not to be called with [Any ${(<any> typeOne).name}, Any ${(<any> typeTwo).name}].`);
   }

   @TestCase(Number)
   @TestCase(String)
   @TestCase(Object)
   @TestCase(Array)
   public anyTypeArgumentOutputAsAnyTypeInExpectedValue(type: new (...args: Array<any>) => Object) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, true, [ Any(type) ]);

      Expect(functionCallError.expected).toBe("function to be called with [Any " + (<any> type).name +  "].");
   }

   @TestCase(Number, Array)
   @TestCase(String, Object)
   @TestCase(Object, String)
   @TestCase(Array, Number)
   public twoAnyTypeArgumentsBothOutputAsAnyTypeInExpectedValue(
                                      typeOne: new (...args: Array<any>) => Object,
                                      typeTwo: new (...args: Array<any>) => Object) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, true, [ Any(typeOne), Any(typeTwo) ]);

      Expect(functionCallError.expected)
        .toBe("function to be called with [Any " + (<any> typeOne).name + ", Any " + (<any> typeTwo).name + "].");
   }

   @TestCase(Number)
   @TestCase(String)
   @TestCase(Object)
   @TestCase(Array)
   public anyTypeArgumentOutputAsAnyTypeInNotExpectedValue(type: new (...args: Array<any>) => Object) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, false, [ Any(type) ]);

      Expect(functionCallError.expected).toBe("function not to be called with [Any " + (<any> type).name + "].");
   }

   @TestCase(Number, Array)
   @TestCase(String, Object)
   @TestCase(Object, String)
   @TestCase(Array, Number)
   public twoAnyTypeArgumentsBothOutputAsAnyTypeInNotExpectedValue(
                                              typeOne: new (...args: Array<any>) => Object,
                                              typeTwo: new (...args: Array<any>) => Object) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, false, [ Any(typeOne), Any(typeTwo) ]);

      Expect(functionCallError.expected)
        .toBe("function not to be called with [Any " + (<any> typeOne).name + ", Any " + (<any> typeTwo).name + "].");
   }

   @TestCase(Number)
   @TestCase(String)
   @TestCase(Object)
   @TestCase(Array)
   public anyAndAnyTypeArgumentsBothOutputAsAnythingAndAnyTypeInMessage(type: new (...args: Array<any>) => Object) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, true, [ Any, Any(type) ]);

      Expect(functionCallError.message)
        .toBe("Expected function to be called with [Anything, Any " + (<any> type).name + "].");
   }

   @TestCase(Number)
   @TestCase(String)
   @TestCase(Object)
   @TestCase(Array)
   public anyAndAnyTypeArgumentsBothOutputAsAnythingAndAnyTypeInMessageAnyTypeInNotExpectedMessage(
                                                                    type: new (...args: Array<any>) => Object) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, false, [ Any, Any(type) ]);

      Expect(functionCallError.message)
        .toBe("Expected function not to be called with [Anything, Any " + (<any> type).name + "].");
   }

   @TestCase(Number)
   @TestCase(String)
   @TestCase(Object)
   @TestCase(Array)
   public anyAndAnyTypeArgumentsBothOutputAsAnythingAndAnyTypeInExpectedValue(
                                                      type: new (...args: Array<any>) => Object) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, true, [ Any, Any(type) ]);

      Expect(functionCallError.expected).toBe("function to be called with [Anything, Any " + (<any> type).name + "].");
   }

   @TestCase(Number)
   @TestCase(String)
   @TestCase(Object)
   @TestCase(Array)
   public anyAndAnyTypeArgumentsBothOutputAsAnythignAndAnyTypeInNotExpectedValue(
                                                            type: new (...args: Array<any>) => Object) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, false, [ Any, Any(type) ]);

      Expect(functionCallError.expected)
        .toBe("function not to be called with [Anything, Any " + (<any> type).name + "].");
   }

   @TestCase(Number)
   @TestCase(String)
   @TestCase(Object)
   @TestCase(Array)
   public anyTypeAndAnyArgumentsBothOutputAsAnyTypeAndAnythingInMessage(type: new (...args: Array<any>) => Object) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, true, [ Any(type), Any ]);

      Expect(functionCallError.message)
        .toBe("Expected function to be called with [Any " + (<any> type).name + ", Anything].");
   }

   @TestCase(Number)
   @TestCase(String)
   @TestCase(Object)
   @TestCase(Array)
   public anyTypeAndAnyArgumentsBothOutputAsAnyTypeAndAnythingInMessageAnyTypeInNotExpectedMessage(
                                                                type: new (...args: Array<any>) => Object) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, false, [ Any(type), Any ]);

      Expect(functionCallError.message)
        .toBe("Expected function not to be called with [Any " + (<any> type).name + ", Anything].");
   }

   @TestCase(Number)
   @TestCase(String)
   @TestCase(Object)
   @TestCase(Array)
   public anyTypeAndAnyArgumentsBothOutputAsAnyTypeAndAnythingInExpectedValue(
                                                          type: new (...args: Array<any>) => Object) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, true, [ Any(type), Any ]);

      Expect(functionCallError.expected).toBe("function to be called with [Any " + (<any> type).name + ", Anything].");
   }

   @TestCase(Number)
   @TestCase(String)
   @TestCase(Object)
   @TestCase(Array)
   public anyTypeAndAnyArgumentsBothOutputAsAnyTypeAndAnythingInNotExpectedValue(
                                                      type: new (...args: Array<any>) => Object) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, false, [ Any(type), Any ]);

      Expect(functionCallError.expected)
        .toBe("function not to be called with [Any " + (<any> type).name + ", Anything].");
   }

   @TestCase(Number)
   @TestCase(String)
   @TestCase(Object)
   @TestCase(Array)
   public anyTypeThatMatchesArgumentOutputAsAnyTypeInMessage<ExpectedType extends Object>(
      type: new (...args: Array<any>) => ExpectedType) {
      let fakeSpy: any = { calls: [] };

      const anyType = Any(type).thatMatches((e: ExpectedType) => true);
      const functionCallError = new FunctionCallMatchError(fakeSpy, true, [anyType]);

      Expect(functionCallError.message)
         .toBe(`Expected function to be called with [${anyType.stringify()}].`);
   }

   @TestCase(Number, Array)
   @TestCase(String, Object)
   @TestCase(Object, String)
   @TestCase(Array, Number)
   public twoAnyTypeThatMatchesArgumentsBothOutputAsAnyTypeInMessage<ExpectedType1 extends Object, ExpectedType2 extends Object>( /* tslint:disable-line:max-line-length */
      typeOne: new (...args: Array<any>) => ExpectedType1,
      typeTwo: new (...args: Array<any>) => ExpectedType2) {
      let fakeSpy: any = { calls: [] };

      const anyTypeOne = Any(typeOne).thatMatches((e: ExpectedType1) => true);
      const anyTypeTwo = Any(typeTwo).thatMatches((e: ExpectedType2) => true);
      const functionCallError = new FunctionCallMatchError(fakeSpy, true, [anyTypeOne, anyTypeTwo]);

      Expect(functionCallError.message)
         .toBe(`Expected function to be called with [${anyTypeOne.stringify()}, ${anyTypeTwo.stringify()}].`);
   }

   @TestCase(Number)
   @TestCase(String)
   @TestCase(Object)
   @TestCase(Array)
   public anyTypeThatMatchesArgumentOutputAsAnyTypeInNotExpectedMessage<ExpectedType extends Object>(
      type: new (...args: Array<any>) => ExpectedType) {
      let fakeSpy: any = { calls: [] };

      const anyType = Any(type).thatMatches((e: ExpectedType) => true);
      const functionCallError = new FunctionCallMatchError(fakeSpy, false, [anyType]);

      Expect(functionCallError.message)
         .toBe(`Expected function not to be called with [${anyType.stringify()}].`);
   }

   @TestCase(Number, Array)
   @TestCase(String, Object)
   @TestCase(Object, String)
   @TestCase(Array, Number)
   public twoAnyTypeThatMatchesArgumentsBothOutputAsAnyTypeInNotExpectedMessage<ExpectedType1 extends Object, ExpectedType2 extends Object>( /* tslint:disable-line:max-line-length */
      typeOne: new (...args: Array<any>) => ExpectedType1,
      typeTwo: new (...args: Array<any>) => ExpectedType2) {
      let fakeSpy: any = { calls: [] };

      const anyTypeOne = Any(typeOne).thatMatches((e: ExpectedType1) => true);
      const anyTypeTwo = Any(typeTwo).thatMatches((e: ExpectedType2) => true);
      const functionCallError = new FunctionCallMatchError(fakeSpy, false, [anyTypeOne, anyTypeTwo]);

      Expect(functionCallError.message)
         .toBe(`Expected function not to be called with [${anyTypeOne.stringify()}, ${anyTypeTwo.stringify()}].`);
   }

   @TestCase(Number)
   @TestCase(String)
   @TestCase(Object)
   @TestCase(Array)
   public anyTypeThatMatchesArgumentOutputAsAnyTypeInExpectedValue<ExpectedType extends Object>(
      type: new (...args: Array<any>) => ExpectedType) {
      let fakeSpy: any = { calls: [] };

      const anyType = Any(type).thatMatches((e: ExpectedType) => true);
      const functionCallError = new FunctionCallMatchError(fakeSpy, true, [anyType]);

      Expect(functionCallError.expected).toBe(`function to be called with [${anyType.stringify()}].`);
   }

   @TestCase(Number, Array)
   @TestCase(String, Object)
   @TestCase(Object, String)
   @TestCase(Array, Number)
   public twoAnyTypeThatMatchesArgumentsBothOutputAsAnyTypeInExpectedValue<ExpectedType1 extends Object, ExpectedType2 extends Object>( /* tslint:disable-line:max-line-length */
      typeOne: new (...args: Array<any>) => ExpectedType1,
      typeTwo: new (...args: Array<any>) => ExpectedType2) {
      let fakeSpy: any = { calls: [] };

      const anyTypeOne = Any(typeOne).thatMatches((e: ExpectedType1) => true);
      const anyTypeTwo = Any(typeTwo).thatMatches((e: ExpectedType2) => true);
      const functionCallError = new FunctionCallMatchError(fakeSpy, true, [anyTypeOne, anyTypeTwo]);

      Expect(functionCallError.expected)
         .toBe(`function to be called with [${anyTypeOne.stringify()}, ${anyTypeTwo.stringify()}].`);
   }

   @TestCase(Number)
   @TestCase(String)
   @TestCase(Object)
   @TestCase(Array)
   public anyTypeArgumentThatMatchesOutputAsAnyTypeInNotExpectedValue<ExpectedType extends Object>(
      type: new (...args: Array<any>) => ExpectedType) {
      let fakeSpy: any = { calls: [] };

      const anyType = Any(type).thatMatches((e: ExpectedType) => true);
      const functionCallError = new FunctionCallMatchError(fakeSpy, false, [anyType]);

      Expect(functionCallError.expected)
         .toBe(`function not to be called with [${anyType.stringify()}].`);
   }

   @TestCase(Number, Array)
   @TestCase(String, Object)
   @TestCase(Object, String)
   @TestCase(Array, Number)
   public twoAnyTypeThatMatchesArgumentsBothOutputAsAnyTypeInNotExpectedValue<ExpectedType1 extends Object, ExpectedType2 extends Object>( /* tslint:disable-line:max-line-length */
      typeOne: new (...args: Array<any>) => ExpectedType1,
      typeTwo: new (...args: Array<any>) => ExpectedType2) {
      let fakeSpy: any = { calls: [] };

      const anyTypeOne = Any(typeOne).thatMatches((e: ExpectedType1) => true);
      const anyTypeTwo = Any(typeTwo).thatMatches((e: ExpectedType2) => true);
      const functionCallError = new FunctionCallMatchError(fakeSpy, false, [anyTypeOne, anyTypeTwo]);

      Expect(functionCallError.expected)
         .toBe(`function not to be called with [${anyTypeOne.stringify()}, ${anyTypeTwo.stringify()}].`);
   }

   @TestCase(Number)
   @TestCase(String)
   @TestCase(Object)
   @TestCase(Array)
   public anyAndAnyTypeThatMatchesArgumentsBothOutputAsAnythingAndAnyTypeInMessage<ExpectedType extends Object>(
      type: new (...args: Array<any>) => ExpectedType) {
      let fakeSpy: any = { calls: [] };

      const anyType = Any(type).thatMatches((e: ExpectedType) => true);
      const functionCallError = new FunctionCallMatchError(fakeSpy, true, [Any, anyType]);

      Expect(functionCallError.message)
         .toBe(`Expected function to be called with [Anything, ${anyType.stringify()}].`);
   }

   @TestCase(Number)
   @TestCase(String)
   @TestCase(Object)
   @TestCase(Array)
   public anyAndAnyTypeThatMatchesArgumentsBothOutputAsAnythingAndAnyTypeInMessageAnyTypeInNotExpectedMessage<ExpectedType extends Object>( /* tslint:disable-line:max-line-length */
      type: new (...args: Array<any>) => ExpectedType) {
      let fakeSpy: any = { calls: [] };

      const anyType = Any(type).thatMatches((e: ExpectedType) => true);
      const functionCallError = new FunctionCallMatchError(fakeSpy, false, [Any, anyType]);

      Expect(functionCallError.message)
         .toBe(`Expected function not to be called with [Anything, ${anyType.stringify()}].`);
   }

   @TestCase(Number)
   @TestCase(String)
   @TestCase(Object)
   @TestCase(Array)
   public anyAndAnyTypeThatMatchesArgumentsBothOutputAsAnythingAndAnyTypeInExpectedValue<ExpectedType extends Object>(
      type: new (...args: Array<any>) => ExpectedType) {
      let fakeSpy: any = { calls: [] };

      const anyType = Any(type).thatMatches((e: ExpectedType) => true);
      const functionCallError = new FunctionCallMatchError(fakeSpy, true, [Any, anyType]);

      Expect(functionCallError.expected)
         .toBe(`function to be called with [Anything, ${anyType.stringify()}].`);
   }

   @TestCase(Number)
   @TestCase(String)
   @TestCase(Object)
   @TestCase(Array)
   public anyAndAnyTypeThatMatchesArgumentsBothOutputAsAnythignAndAnyTypeInNotExpectedValue<ExpectedType extends Object>( /* tslint:disable-line:max-line-length */
      type: new (...args: Array<any>) => ExpectedType) {
      let fakeSpy: any = { calls: [] };

      const anyType = Any(type).thatMatches((e: ExpectedType) => true);
      const functionCallError = new FunctionCallMatchError(fakeSpy, false, [Any, anyType]);

      Expect(functionCallError.expected)
         .toBe(`function not to be called with [Anything, ${anyType.stringify()}].`);
   }

   @TestCase(Number)
   @TestCase(String)
   @TestCase(Object)
   @TestCase(Array)
   public anyTypeAndAnyThatMatchesArgumentsBothOutputAsAnyTypeAndAnythingInMessage<ExpectedType extends Object>(
      type: new (...args: Array<any>) => ExpectedType) {
      let fakeSpy: any = { calls: [] };

      const anyType = Any(type).thatMatches((e: ExpectedType) => true);
      const functionCallError = new FunctionCallMatchError(fakeSpy, true, [anyType, Any]);

      Expect(functionCallError.message)
         .toBe(`Expected function to be called with [${anyType.stringify()}, Anything].`);
   }

   @TestCase(Number)
   @TestCase(String)
   @TestCase(Object)
   @TestCase(Array)
   public anyTypeAndAnyThatMatchesArgumentsBothOutputAsAnyTypeAndAnythingInMessageAnyTypeInNotExpectedMessage<ExpectedType extends Object>( /* tslint:disable-line:max-line-length */
      type: new (...args: Array<any>) => ExpectedType) {
      let fakeSpy: any = { calls: [] };

      const anyType = Any(type).thatMatches((e: ExpectedType) => true);
      const functionCallError = new FunctionCallMatchError(fakeSpy, false, [anyType, Any]);

      Expect(functionCallError.message)
         .toBe(`Expected function not to be called with [${anyType.stringify()}, Anything].`);
   }

   @TestCase(Number)
   @TestCase(String)
   @TestCase(Object)
   @TestCase(Array)
   public anyTypeAndAnyThatMatchesArgumentsBothOutputAsAnyTypeAndAnythingInExpectedValue<ExpectedType extends Object>(
      type: new (...args: Array<any>) => ExpectedType) {
      let fakeSpy: any = { calls: [] };

      const anyType = Any(type).thatMatches((e: ExpectedType) => true);
      const functionCallError = new FunctionCallMatchError(fakeSpy, true, [anyType, Any]);

      Expect(functionCallError.expected)
         .toBe(`function to be called with [${anyType.stringify()}, Anything].`);
   }

   @TestCase(Number)
   @TestCase(String)
   @TestCase(Object)
   @TestCase(Array)
   public anyTypeAndAnyThatMatchesArgumentsBothOutputAsAnyTypeAndAnythingInNotExpectedValue<ExpectedType extends Object>( /* tslint:disable-line:max-line-length */
      type: new (...args: Array<any>) => ExpectedType) {
      let fakeSpy: any = { calls: [] };

      const anyType = Any(type).thatMatches((e: ExpectedType) => true);
      const functionCallError = new FunctionCallMatchError(fakeSpy, false, [anyType, Any]);

      Expect(functionCallError.expected)
         .toBe(`function not to be called with [${anyType.stringify()}, Anything].`);
   }

   @TestCase("test")
   @TestCase(42)
   @TestCase("something else")
   @TestCase(-42)
   public exactAndAnyArgumentsBothOutputAsExactAndAnythingInMessage( exactValue: any) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, true, [ exactValue, Any]);

      Expect(functionCallError.message)
        .toBe("Expected function to be called with [" + JSON.stringify(exactValue) + ", Anything].");
   }

   @TestCase("test")
   @TestCase(42)
   @TestCase("something else")
   @TestCase(-42)
   public exactAndAnyArgumentsBothOutputAsExactAndAnythingInMessageAnyTyoeInNotExpectedMessage(exactValue: any) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, false, [ exactValue, Any]);

      Expect(functionCallError.message)
        .toBe("Expected function not to be called with [" + JSON.stringify(exactValue) + ", Anything].");
   }

   @TestCase("test")
   @TestCase(42)
   @TestCase("something else")
   @TestCase(-42)
   public exactAndAnyArgumentsBothOutputAsExactAndAnythingInExpectedValue(exactValue: any) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, true, [ exactValue, Any]);

      Expect(functionCallError.expected)
        .toBe("function to be called with [" + JSON.stringify(exactValue) + ", Anything].");
   }

   @TestCase("test")
   @TestCase(42)
   @TestCase("something else")
   @TestCase(-42)
   public exactAndAnyArgumentsBothOutputAsExactAndAnythingInNotExpectedValue(exactValue: any) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, false, [ exactValue, Any]);

      Expect(functionCallError.expected)
        .toBe("function not to be called with [" + JSON.stringify(exactValue) + ", Anything].");
   }

   @TestCase("test")
   @TestCase(42)
   @TestCase("something else")
   @TestCase(-42)
   public anyAndExactArgumentsBothOutputAsAnythingAndExactInMessage(exactValue: any) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, true, [ Any, exactValue ]);

      Expect(functionCallError.message)
        .toBe("Expected function to be called with [Anything, " + JSON.stringify(exactValue) + "].");
   }

   @TestCase("test")
   @TestCase(42)
   @TestCase("something else")
   @TestCase(-42)
   public anyAndExaactArgumentsBothOutputAsAnythingAndExactInMessageAnyTyoeInNotExpectedMessage(exactValue: any) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, false, [ Any, exactValue ]);

      Expect(functionCallError.message)
        .toBe("Expected function not to be called with [Anything, " + JSON.stringify(exactValue) + "].");
   }

   @TestCase("test")
   @TestCase(42)
   @TestCase("something else")
   @TestCase(-42)
   public anyAndExactArgumentsBothOutputAsAnythingAndExactInExpectedValue(exactValue: any) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, true, [ Any, exactValue ]);

      Expect(functionCallError.expected)
        .toBe("function to be called with [Anything, " + JSON.stringify(exactValue) + "].");
   }

   @TestCase("test")
   @TestCase(42)
   @TestCase("something else")
   @TestCase(-42)
   public anyAndExactArgumentsBothOutputAsAnythingAndExactInNotExpectedValue(exactValue: any) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, false, [ Any, exactValue ]);

      Expect(functionCallError.expected)
        .toBe("function not to be called with [Anything, " + JSON.stringify(exactValue) + "].");
   }

   @TestCase(Number, "test")
   @TestCase(String, 42)
   @TestCase(Object, "something else")
   @TestCase(Array, -42)
   public exactAndAnyTypeArgumentsBothOutputAsExactAndAnyTypeInMessage(
                                                  type: new (...args: Array<any>) => Object,
                                                  exactValue: any) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, true, [ exactValue, Any(type) ]);

      Expect(functionCallError.message)
        .toBe(`Expected function to be called with [${JSON.stringify(exactValue)}, Any ${(<any> type).name}].`);
   }

   @TestCase(Number, "test")
   @TestCase(String, 42)
   @TestCase(Object, "something else")
   @TestCase(Array, -42)
   public exactAndAnyTypeArgumentsBothOutputAsExactAndAnyTypeInMessageAnyTypeInNotExpectedMessage(
                                                                  type: new (...args: Array<any>) => Object,
                                                                  exactValue: any) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, false, [ exactValue, Any(type) ]);

      Expect(functionCallError.message)
        .toBe(`Expected function not to be called with [${JSON.stringify(exactValue)}, Any ${(<any> type).name}].`);
   }

   @TestCase(Number, "test")
   @TestCase(String, 42)
   @TestCase(Object, "something else")
   @TestCase(Array, -42)
   public exactAndAnyTypeArgumentsBothOutputAsExactAndAnyTypeInExpectedValue(
                                                      type: new (...args: Array<any>) => Object,
                                                      exactValue: any) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, true, [ exactValue, Any(type) ]);

      Expect(functionCallError.expected)
        .toBe("function to be called with [" + JSON.stringify(exactValue) + ", Any " + (<any> type).name + "].");
   }

   @TestCase(Number, "test")
   @TestCase(String, 42)
   @TestCase(Object, "something else")
   @TestCase(Array, -42)
   public exactAndAnyTypeArgumentsBothOutputAsExactAndAnyTypeInNotExpectedValue(
                                              type: new (...args: Array<any>) => Object,
                                              exactValue: any) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, false, [ exactValue, Any(type) ]);

      Expect(functionCallError.expected)
        .toBe("function not to be called with [" + JSON.stringify(exactValue) + ", Any " + (<any> type).name + "].");
   }

   @TestCase(Number, "test")
   @TestCase(String, 42)
   @TestCase(Object, "something else")
   @TestCase(Array, -42)
   public anyTypeAndExactArgumentsBothOutputAsAnyTypeAndExactInMessage(
                                                    type: new (...args: Array<any>) => Object,
                                                    exactValue: any) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, true, [ Any(type), exactValue ]);

      Expect(functionCallError.message)
        .toBe(`Expected function to be called with [Any ${(<any> type).name}, ${JSON.stringify(exactValue)}].`);
   }

   @TestCase(Number, "test")
   @TestCase(String, 42)
   @TestCase(Object, "something else")
   @TestCase(Array, -42)
   public anyTypeAndExaactArgumentsBothOutputAsAnyTypeAndExactInMessageAnyTyoeInNotExpectedMessage(
                                                                    type: new (...args: Array<any>) => Object,
                                                                    exactValue: any) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, false, [ Any(type), exactValue ]);

      Expect(functionCallError.message)
        .toBe(`Expected function not to be called with [Any ${(<any> type).name}, ${JSON.stringify(exactValue)}].`);
   }

   @TestCase(Number, "test")
   @TestCase(String, 42)
   @TestCase(Object, "something else")
   @TestCase(Array, -42)
   public anyTypeAndExactArgumentsBothOutputAsAnyTypeAndExactInExpectedValue(
                                            type: new (...args: Array<any>) => Object,
                                            exactValue: any) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, true, [ Any(type), exactValue ]);

      Expect(functionCallError.expected)
        .toBe("function to be called with [Any " + (<any> type).name + ", " + JSON.stringify(exactValue) + "].");
   }

   @TestCase(Number, "test")
   @TestCase(String, 42)
   @TestCase(Object, "something else")
   @TestCase(Array, -42)
   public anyTypeAndExactArgumentsBothOutputAsAnyTypeAndExactInNotExpectedValue(
                                                type: new (...args: Array<any>) => Object,
                                                exactValue: any) {
      let fakeSpy: any = { calls: [ ] };

      const functionCallError = new FunctionCallMatchError(fakeSpy, false, [ Any(type), exactValue ]);

      Expect(functionCallError.expected)
        .toBe("function not to be called with [Any " + (<any> type).name + ", " + JSON.stringify(exactValue) + "].");
   }

   @TestCase(Number, "test")
   @TestCase(String, 42)
   @TestCase(Object, "something else")
   @TestCase(Array, -42)
   public exactAndAnyTypeThatMatchesArgumentsBothOutputAsExactAndAnyTypeInMessage<ExpectedType extends Object>(
                                                  type: new (...args: Array<any>) => ExpectedType,
                                                  exactValue: any) {
      let fakeSpy: any = { calls: [ ] };

      const anyType = Any(type).thatMatches((v: ExpectedType) => true);
      const functionCallError = new FunctionCallMatchError(fakeSpy, true, [ exactValue, anyType ]);

      Expect(functionCallError.message)
        .toBe(`Expected function to be called with [${JSON.stringify(exactValue)}, ${anyType.stringify()}].`);
   }

   @TestCase(Number, "test")
   @TestCase(String, 42)
   @TestCase(Object, "something else")
   @TestCase(Array, -42)
   public exactAndAnyTypeThatMatchesArgumentsBothOutputAsExactAndAnyTypeInMessageAnyTypeInNotExpectedMessage<ExpectedType extends Object>( /* tslint:disable-line:max-line-length */
                                                                  type: new (...args: Array<any>) => ExpectedType,
                                                                  exactValue: any) {
      let fakeSpy: any = { calls: [ ] };

      const anyType = Any(type).thatMatches((v: ExpectedType) => true);
      const functionCallError = new FunctionCallMatchError(fakeSpy, false, [ exactValue, anyType ]);

      Expect(functionCallError.message)
        .toBe(`Expected function not to be called with [${JSON.stringify(exactValue)}, ${anyType.stringify()}].`);
   }

   @TestCase(Number, "test")
   @TestCase(String, 42)
   @TestCase(Object, "something else")
   @TestCase(Array, -42)
   public exactAndAnyTypeThatMatchesArgumentsBothOutputAsExactAndAnyTypeInExpectedValue<ExpectedType extends Object>(
                                                      type: new (...args: Array<any>) => Object,
                                                      exactValue: any) {
      let fakeSpy: any = { calls: [ ] };

      const anyType = Any(type).thatMatches((v: ExpectedType) => true);
      const functionCallError = new FunctionCallMatchError(fakeSpy, true, [ exactValue, anyType ]);

      Expect(functionCallError.expected)
        .toBe(`function to be called with [${JSON.stringify(exactValue)}, ${anyType.stringify()}].`);
   }

   @TestCase(Number, "test")
   @TestCase(String, 42)
   @TestCase(Object, "something else")
   @TestCase(Array, -42)
   public exactAndAnyTypeThatMatchesArgumentsBothOutputAsExactAndAnyTypeInNotExpectedValue<ExpectedType extends Object>(
                                              type: new (...args: Array<any>) => Object,
                                              exactValue: any) {
      let fakeSpy: any = { calls: [ ] };

      const anyType = Any(type).thatMatches((v: ExpectedType) => true);
      const functionCallError = new FunctionCallMatchError(fakeSpy, false, [ exactValue, anyType ]);

      Expect(functionCallError.expected)
        .toBe(`function not to be called with [${JSON.stringify(exactValue)}, ${anyType.stringify()}].`);
   }

   @TestCase(Number, "test")
   @TestCase(String, 42)
   @TestCase(Object, "something else")
   @TestCase(Array, -42)
   public anyTypeAndExactThatMatchesArgumentsBothOutputAsAnyTypeAndExactInMessage<ExpectedType extends Object>(
                                                    type: new (...args: Array<any>) => Object,
                                                    exactValue: any) {
      let fakeSpy: any = { calls: [ ] };

      const anyType = Any(type).thatMatches((v: ExpectedType) => true);
      const functionCallError = new FunctionCallMatchError(fakeSpy, true, [ anyType, exactValue ]);

      Expect(functionCallError.message)
        .toBe(`Expected function to be called with [${anyType.stringify()}, ${JSON.stringify(exactValue)}].`);
   }

   @TestCase(Number, "test")
   @TestCase(String, 42)
   @TestCase(Object, "something else")
   @TestCase(Array, -42)
   public anyTypeAndExactThatMatchesArgumentsBothOutputAsAnyTypeAndExactInMessageAnyTyoeInNotExpectedMessage<ExpectedType extends Object>( /* tslint:disable-line:max-line-length */
                                                                    type: new (...args: Array<any>) => Object,
                                                                    exactValue: any) {
      let fakeSpy: any = { calls: [ ] };

      const anyType = Any(type).thatMatches((v: ExpectedType) => true);
      const functionCallError = new FunctionCallMatchError(fakeSpy, false, [ anyType, exactValue ]);

      Expect(functionCallError.message)
        .toBe(`Expected function not to be called with [${anyType.stringify()}, ${JSON.stringify(exactValue)}].`);
   }

   @TestCase(Number, "test")
   @TestCase(String, 42)
   @TestCase(Object, "something else")
   @TestCase(Array, -42)
   public anyTypeAndExactThatMatchesArgumentsBothOutputAsAnyTypeAndExactInExpectedValue<ExpectedType extends Object>(
                                            type: new (...args: Array<any>) => Object,
                                            exactValue: any) {
      let fakeSpy: any = { calls: [ ] };

      const anyType = Any(type).thatMatches((v: ExpectedType) => true);
      const functionCallError = new FunctionCallMatchError(fakeSpy, true, [ anyType, exactValue ]);

      Expect(functionCallError.expected)
        .toBe(`function to be called with [${anyType.stringify()}, ${JSON.stringify(exactValue)}].`);
   }

   @TestCase(Number, "test")
   @TestCase(String, 42)
   @TestCase(Object, "something else")
   @TestCase(Array, -42)
   public anyTypeAndExactThatMatchesArgumentsBothOutputAsAnyTypeAndExactInNotExpectedValue<ExpectedType extends Object>(
                                                type: new (...args: Array<any>) => Object,
                                                exactValue: any) {
      let fakeSpy: any = { calls: [ ] };

      const anyType = Any(type).thatMatches((v: ExpectedType) => true);
      const functionCallError = new FunctionCallMatchError(fakeSpy, false, [ anyType, exactValue ]);

      Expect(functionCallError.expected)
        .toBe(`function not to be called with [${anyType.stringify()}, ${JSON.stringify(exactValue)}].`);
   }
}
