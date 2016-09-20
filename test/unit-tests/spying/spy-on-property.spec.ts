import { Expect, Test, TestCase, SpyOnProperty } from "../../../core/alsatian-core";

class Testing {
   get test() {
      return 42;
   }
}

export class SpyOnPropertyTests {

   @Test()
   public getterIsReplacedWithSpy() {
      const object = { };

      const originalGetter = () => {};

      Object.defineProperty(object, "property", { get: originalGetter, configurable: true });

      SpyOnProperty(object, "property");

      Expect(Object.getOwnPropertyDescriptor(object, "property").get).not.toBe(originalGetter);
   }

   @Test()
   public setterIsReplacedWithSpy() {
      const object = { };

      const originalSetter = () => {};

      Object.defineProperty(object, "property", { set: originalSetter, configurable: true });

      SpyOnProperty(object, "property");

      Expect(Object.getOwnPropertyDescriptor(object, "property").set).not.toBe(originalSetter);
   }


   @TestCase(undefined)
   @TestCase(null)
   @TestCase(0)
   @TestCase(1)
   @TestCase(42)
   @TestCase("")
   @TestCase("something")
   @TestCase({})
   @TestCase({ "an": "object"})
   @TestCase([])
   @TestCase([ "an", "array" ])
   public propertyStillReturnsOriginalValue(originalValue: any) {
      const object: any = {
         _property: false
      };

      Object.defineProperty(object, "property", { get: () => originalValue, configurable: true });

      SpyOnProperty(object, "property");

      Expect(object.property).toBe(originalValue);
   }

   @Test()
   public spyShouldBeReturned() {
      let object = { };

      Object.defineProperty(object, "property", { get: () => {}, configurable: true });

      let spy = SpyOnProperty(object, "property");

      Expect(spy).toBeDefined();
      Expect(spy).not.toBeNull();
   }

   @TestCase("property")
   @TestCase("proper tea")
   @TestCase("anotherProperty")
   public spyingOnNonPropertyShouldThrowError(propertyName: string) {
      let object: { [propertyName: string]: any } = { };

      Expect(() => SpyOnProperty(object, propertyName)).toThrowError(TypeError, `${propertyName} is not a property.`);
   }

   @TestCase("property")
   @TestCase("proper tea")
   @TestCase("anotherProperty")
   public spyingOnPropertyShouldNotThrowError(propertyName: string) {
      let object: { [propertyName: string]: any } = { };

      Object.defineProperty(object, propertyName, { get: () => {}, configurable: true });

      Expect(() => SpyOnProperty(object, propertyName)).not.toThrow();
   }
}
