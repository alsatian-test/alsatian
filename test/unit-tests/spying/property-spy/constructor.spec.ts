import { Expect, Test, TestCase, FocusTests, FocusTest } from "../../../../core/alsatian-core";
import { PropertySpy } from "../../../../core/_spying";

class Testing {
   set property(value: number) {

   }
   get property() {
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
      const object = new Testing();

      const originalGetter = () => "";

      Object.defineProperty(object.constructor.prototype, "property", { get: originalGetter, configurable: true });

      new PropertySpy(object, "property");

      Expect(Object.getOwnPropertyDescriptor(object, "property").get).toBeDefined();
      Expect(Object.getOwnPropertyDescriptor(object, "property").get).not.toBeNull();
      Expect(Object.getOwnPropertyDescriptor(object, "property").get).not.toBe(originalGetter);
   }

   @Test()
   public typescriptSetterIsOverridenWithSpy() {
      const object = new Testing();

      const originalSetter = Object.getOwnPropertyDescriptor(object.constructor.prototype, "property").set;

      new PropertySpy(object, "property");

      Expect(Object.getOwnPropertyDescriptor(object, "property").set).toBeDefined();
      Expect(Object.getOwnPropertyDescriptor(object, "property").set).not.toBeNull();
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
