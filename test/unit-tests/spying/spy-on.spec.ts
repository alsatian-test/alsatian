import { Expect, SpyOn, Test, TestCase } from "../../../core/alsatian-core";

export class SpyOnTests {

   @Test()
   public functionIsReplacedWithSpy() {
      let object = {
         function: () => undefined
      };

      let originalFunction = object.function;

      SpyOn(object, "function");

      Expect(object.function).not.toBe(originalFunction);
   }

   @Test()
   public functionStillWorks() {
      let object = {
         function: () => {
            object.functionCalled = true;
         },
         functionCalled: false
      };

      let originalFunction = object.function;

      SpyOn(object, "function");
      object.function();

      Expect(object.functionCalled).toBe(true);
   }

   @Test()
   public callsPropertyIsSetOnFunction() {
      let object = {
         function: () => undefined
      };

      let originalFunction = object.function;

      SpyOn(object, "function");

      Expect((<any> object.function).calls).toBeDefined();
      Expect((<any> object.function).calls).not.toBeNull();
   }

   @Test()
   public spyShouldBeReturned() {
      let object = {
         function: () => undefined
      };

      let originalFunction = object.function;

      let spy = SpyOn(object, "function");

      Expect(spy).toBeDefined();
      Expect(spy).not.toBeNull();
   }

   @TestCase("undefined", undefined)
   @TestCase("null", null)
   @TestCase("number", 42)
   @TestCase("string", "something")
   public spyingOnNonFunctionShouldThrowError(propertyName: string, propertyValue: any) {
      let object: { [propertyName: string]: any } = { };

      object[propertyName] = propertyValue;

      Expect(() => SpyOn(object, propertyName)).toThrowError(TypeError, `${propertyName} is not a function.`);
   }
}
