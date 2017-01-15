import { Expect, FunctionSpy, SpyOn, Test, TestCase } from "../../../../core/alsatian-core";
import { PropertySpy } from "../../../../core/spying";

export class AndCallGetterTests {

   @Test()
   public originalGetterCalled() {

      const testObject: any = { };

      const propertyDescriptor = { get: () => undefined, configurable: true };

      SpyOn(propertyDescriptor, "get");

      Object.defineProperty(testObject, "property", propertyDescriptor);

      new PropertySpy(testObject, "property");

      testObject.property;

      Expect(propertyDescriptor.get).toHaveBeenCalled();
   }

   @Test()
   public originalGetterNotCalledIfGetterOverloaded() {

      const testObject: any = { };

      const propertyDescriptor = { get: () => undefined, configurable: true };

      SpyOn(propertyDescriptor, "get");

      Object.defineProperty(testObject, "property", propertyDescriptor);

      new PropertySpy(testObject, "property").andCallGetter(() => undefined);

      testObject.property;

      Expect(propertyDescriptor.get).not.toHaveBeenCalled();
   }

   @Test()
   public propertySpyIsReturned() {

      const testObject: any = { };

      const propertyDescriptor = { get: () => undefined, configurable: true };

      SpyOn(propertyDescriptor, "get");

      Object.defineProperty(testObject, "property", propertyDescriptor);

      const propertySpy = new PropertySpy(testObject, "property");

      Expect(propertySpy.andCallGetter(() => undefined)).toBe(propertySpy);
   }

   @TestCase(null)
   @TestCase(undefined)
   @TestCase(42)
   @TestCase("something")
   @TestCase({ an: "object" })
   @TestCase([ "an", "array" ])
   public newValueIsReturned(value: any) {

      const testObject: any = { };

      const propertyDescriptor = { get: () => undefined, configurable: true };

      SpyOn(propertyDescriptor, "get");

      Object.defineProperty(testObject, "property", propertyDescriptor);

      new PropertySpy(testObject, "property").andCallGetter(() => value);

      Expect(testObject.property).toBe(value);
   }

   @TestCase(null, [ "an", "array" ])
   @TestCase(undefined, { an: "object" })
   @TestCase(42, "something")
   @TestCase("something", 42)
   @TestCase({ an: "object" }, undefined)
   @TestCase([ "an", "array" ], null)
   public andCallGetterValueIsReturnedWhenReturnValueIsCalledPreviously(getterValue: any, andReturnValue: any) {

      const testObject: any = { };

      const propertyDescriptor = { get: () => undefined, configurable: true };

      SpyOn(propertyDescriptor, "get");

      Object.defineProperty(testObject, "property", propertyDescriptor);

      new PropertySpy(testObject, "property").andReturnValue(andReturnValue).andCallGetter(() => getterValue);

      Expect(testObject.property).toBe(getterValue);
   }

   @TestCase(null, [ "an", "array" ])
   @TestCase(undefined, { an: "object" })
   @TestCase(42, "something")
   @TestCase("something", 42)
   @TestCase({ an: "object" }, undefined)
   @TestCase([ "an", "array" ], null)
   public andReturnValueValueIsReturnedWhenReturnValueIsCalledAfter(getterValue: any, andReturnValue: any) {

      const testObject: any = { };

      const propertyDescriptor = { get: () => undefined, configurable: true };

      SpyOn(propertyDescriptor, "get");

      Object.defineProperty(testObject, "property", propertyDescriptor);

      new PropertySpy(testObject, "property").andCallGetter(() => getterValue).andReturnValue(andReturnValue);

      Expect(testObject.property).toBe(andReturnValue);
   }
}
