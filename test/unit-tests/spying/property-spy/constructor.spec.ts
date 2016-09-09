import { Expect, Test, TestCase } from "../../../../core/alsatian-core";
import { PropertySpy } from "../../../../core/_spying";

class Testing {
   get test() {
      return 42;
   }
}

export class PropertySpyConstructorTests {

   @Test()
   public getterIsReplacedWithSpy() {
      const object = { };

      const originalGetter = () => {};

      Object.defineProperty(object, "property", { get: originalGetter, configurable: true });

      new PropertySpy(object, "property");

      Expect(Object.getOwnPropertyDescriptor(object, "property").get).not.toBe(originalGetter);
   }

   @Test()
   public setterIsReplacedWithSpy() {
      const object = { };

      const originalSetter = () => {};

      Object.defineProperty(object, "property", { set: originalSetter, configurable: true });

      new PropertySpy(object, "property");

      Expect(Object.getOwnPropertyDescriptor(object, "property").set).not.toBe(originalSetter);
   }

   @Test()
   public typescriptGetterIsReplacedWithSpy() {
      const object = {
         constructor: {
            prototype: { }
         }
      };

      const originalGetter = () => {};

      Object.defineProperty(object.constructor.prototype, "property", { get: originalGetter, configurable: true });

      new PropertySpy(object, "property");

      Expect(Object.getOwnPropertyDescriptor(object.constructor.prototype, "property").get).not.toBe(originalGetter);
   }

   @Test()
   public typescriptSetterIsReplacedWithSpy() {
      const object = {
         constructor: {
            prototype: { }
         }
      };

      const originalSetter = () => {};

      Object.defineProperty(object.constructor.prototype, "property", { set: originalSetter, configurable: true });

      new PropertySpy(object, "property");

      Expect(Object.getOwnPropertyDescriptor(object.constructor.prototype, "property").set).not.toBe(originalSetter);
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

      new PropertySpy(object, "property");

      Expect(object.property).toBe(originalValue);
   }

   @Test()
   public spyShouldBeReturned() {
      let object = { };

      Object.defineProperty(object, "property", { get: () => {}, configurable: true });

      let spy = new PropertySpy(object, "property");

      Expect(spy).toBeDefined();
      Expect(spy).not.toBeNull();
   }

   @TestCase("property")
   @TestCase("proper tea")
   @TestCase("anotherProperty")
   public spyingOnNonPropertyShouldThrowError(propertyName: string) {
      let object: { [propertyName: string]: any } = { };

      Expect(() => new PropertySpy(object, propertyName)).toThrowError(TypeError, `${propertyName} is not a property.`);
   }

   @TestCase("property")
   @TestCase("proper tea")
   @TestCase("anotherProperty")
   public spyingOnPropertyShouldNotThrowError(propertyName: string) {
      let object: { [propertyName: string]: any } = { };

      Object.defineProperty(object, propertyName, { get: () => {}, configurable: true });

      Expect(() => new PropertySpy(object, propertyName)).not.toThrow();
   }
}
