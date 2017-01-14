import { PropertySpy } from "../../../../core/spying";
import { Test, Expect, SpyOn, TestCase } from "../../../../core/alsatian-core";

export class AndCallSetterTests {

   @Test()
   public originalSetterCalled() {

      const testObject: any = { };

      const propertyDescriptor = { set: (value: any) => { testObject._secretValue = value; }, configurable: true };

      SpyOn(propertyDescriptor, "set");

      Object.defineProperty(testObject, "property", propertyDescriptor);

      new PropertySpy(testObject, "property");

      testObject.property = "something";

      Expect(propertyDescriptor.set).toHaveBeenCalled();
   }

   @Test()
   public originalSetterNotCalledIfSetterOverloaded() {

      const testObject: any = { };

      const propertyDescriptor = { set: (value: any) => { testObject._secretValue = value; }, configurable: true };

      SpyOn(propertyDescriptor, "set");

      Object.defineProperty(testObject, "property", propertyDescriptor);

      new PropertySpy(testObject, "property").andCallSetter(() => undefined);

      testObject.property = "something";

      Expect(propertyDescriptor.set).not.toHaveBeenCalled();
   }

   @Test()
   public propertySpyIsReturned() {

      const testObject: any = { };

      const propertyDescriptor = { set: (value: any) => { testObject._secretValue = value; }, configurable: true };

      SpyOn(propertyDescriptor, "set");

      Object.defineProperty(testObject, "property", propertyDescriptor);

      const propertySpy = new PropertySpy(testObject, "property");

      Expect(propertySpy.andCallSetter(() => undefined)).toBe(propertySpy);
   }

   @TestCase(null)
   @TestCase(undefined)
   @TestCase(42)
   @TestCase("something")
   @TestCase({ "an": "object" })
   @TestCase([ "an", "array" ])
   public newValueIsSet(value: any) {

      const testObject: any = { };

      const propertyDescriptor = { set: (value: any) => {}, get: () => testObject._secretValue, configurable: true };

      SpyOn(propertyDescriptor, "set");

      Object.defineProperty(testObject, "property", propertyDescriptor);

      new PropertySpy(testObject, "property").andCallSetter((value: any) => { testObject._secretValue = value; });

      testObject.property = value;

      Expect(testObject.property).toBe(value);
   }

   @TestCase(null, [ "an", "array" ])
   @TestCase(undefined, { "an": "object" })
   @TestCase(42, "something")
   @TestCase("something", 42)
   @TestCase({ "an": "object" }, undefined)
   @TestCase([ "an", "array" ], null)
   public andCallSetterValueIsReturnedWhenReturnValueIsCalledPreviously(setterValue: any, andReturnValue: any) {

      const testObject: any = { };

      const propertyDescriptor = { set: () => {}, get: () => testObject._secretValue, configurable: true };

      SpyOn(propertyDescriptor, "set");

      Object.defineProperty(testObject, "property", propertyDescriptor);

      new PropertySpy(testObject, "property").andReturnValue(andReturnValue).andCallSetter((value: any) => { testObject._secretValue = value; });

      testObject.property = setterValue;

      Expect(testObject.property).toBe(setterValue);
   }

   @TestCase(null, [ "an", "array" ])
   @TestCase(undefined, { "an": "object" })
   @TestCase(42, "something")
   @TestCase("something", 42)
   @TestCase({ "an": "object" }, undefined)
   @TestCase([ "an", "array" ], null)
   public andReturnValueValueIsReturnedWhenReturnValueIsCalledAfter(setterValue: any, andReturnValue: any) {

      const testObject: any = { };

      const propertyDescriptor = { set: () => {}, get: () => testObject._secretValue, configurable: true };

      SpyOn(propertyDescriptor, "set");

      Object.defineProperty(testObject, "property", propertyDescriptor);

      new PropertySpy(testObject, "property").andCallSetter((value: any) => { testObject._secretValue = value; }).andReturnValue(andReturnValue);

      testObject.property = setterValue;

      Expect(testObject.property).toBe(andReturnValue);
   }
}
