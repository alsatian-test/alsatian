import { Expect, FocusTest, Test, TestCase } from "../../../core/alsatian-core";
import { FunctionCallMatchError } from "../../../core/errors/function-call-match-error";
import { ArgumentMatcher } from "../../../core/spying/argument-matcher";
import { FunctionSpy } from  "../../../core/spying/function-spy";
import { Matches } from "../../../core/spying/matches-argument";

/* tslint:disable */
class GrandParent {
   constructor() { }
 }

class Parent extends GrandParent {
   constructor() { super(); }
}

class Child extends Parent {
   constructor() { super(); }
}
/*tslint:enable */

export class AnyArgumentsTests {

   @TestCase(null)
   @TestCase(undefined)
   public nullOrUndefinedTypesThrowError(ctor: any) {
      Expect(() => Matches(ctor, (v) => true)).toThrowError(TypeError, "ctor must not be null or undefined");
   }

   @TestCase(null)
   @TestCase(undefined)
   public nullOrUndefinedMatcherThrowError(tester: any) {
      Expect(() => Matches(Error, tester)).toThrowError(TypeError, "tester must not be null or undefined");
   }

   @TestCase(Number)
   @TestCase(String)
   @TestCase(Boolean)
   @TestCase(Array)
   @TestCase(Object)
   @TestCase(Error)
   public matchesReturnsTypeMatcher(type: new (...args: Array<any>) => Object) {
      Expect(Matches(Error, (v) => true) instanceof ArgumentMatcher).toBe(true);
   }

   @TestCase(true, true)
   @TestCase(false, false)
   public matchesUsesTesterForComparison(testerReturnValue: boolean, expectedReturnValue: boolean) {
      const tester: (v: Error) => boolean = (v) => testerReturnValue;
      const sut = Matches(Error, tester);

      Expect(sut.test(new Error())).toBe(expectedReturnValue);
   }

   @Test()
   public matchesReturnsFalseOnInvalidType() {
      const spy = new FunctionSpy();
      const sut = Matches(Error, v => { spy.call(); return true; });

      Expect(sut.test(new Date())).toBe(false);
   }

   @Test()
   public matchesDoesNotCallTesterOnInvalidType() {
      const spy = new FunctionSpy();
      const sut = Matches(Error, v => { spy.call(); return true; });

      sut.test(new Date());

      Expect(spy).not.toHaveBeenCalled();
   }

   @TestCase(GrandParent)
   @TestCase(Parent)
   @TestCase(Child)
   public matchesRespectsInheritanceHierarchy(ctor: new (...args: Array<any>) => Object) {
      const spy = new FunctionSpy();
      const sut = Matches(GrandParent, v => { spy.call(); return true; });

      Expect(sut.test(new ctor())).toBe(true);

      Expect(spy).toHaveBeenCalled().exactly(1).times;
   }

   @Test()
   public toHaveBeenCalledWithWorksAsExpected() {
      const matches = Matches(Error, (e: Error) => e.message === "Some error");

      Expect(() => {
         const spy = new FunctionSpy();
         spy.call(new Error("Some other error"));
         Expect(spy).not.toHaveBeenCalledWith(matches);
      }).not.toThrow();

      Expect(() => {
         const spy = new FunctionSpy();
         spy.call(new Error("Some error"));
         Expect(spy).toHaveBeenCalledWith(matches).exactly(1).times;
      }).not.toThrow();
   }

   @Test()
   public toHaveBeenCalledWithReturnsExpectedError() {
      const matches = Matches(Error, (e: Error) => e.message === "Some error");
      const spy = new FunctionSpy();
      spy.call(new Error("Some other error"));

      /* tslint:disable:max-line-length */
      const expectedMessage = `Expected function to be called with [${matches.stringify()}].`;
      /* tslint:enable */

      Expect(() => {
         Expect(spy).toHaveBeenCalledWith(matches);
      }).toThrowError(FunctionCallMatchError, expectedMessage);
   }
}
