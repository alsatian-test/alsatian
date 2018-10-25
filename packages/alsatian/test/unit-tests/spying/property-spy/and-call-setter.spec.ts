import {
  Expect,
  FunctionSpy,
  SpyOn,
  Test,
  TestCase
} from "../../../../core/alsatian-core";
import { PropertySpy } from "../../../../core/spying";

export class AndCallSetterTests {
  @Test()
  public originalSetterCalled() {
    const testObject: any = {};

    const propertyDescriptor = {
      set: (value: any) => {
        testObject._secretValue = value;
      },
      configurable: true
    };

    SpyOn(propertyDescriptor, "set");

    Object.defineProperty(testObject, "property", propertyDescriptor);

    const propertySpy = new PropertySpy(testObject, "property");

    testObject.property = "something";

    Expect(propertyDescriptor.set).toHaveBeenCalled();
  }

  @Test()
  public originalSetterNotCalledIfSetterOverloaded() {
    const testObject: any = {};

    const propertyDescriptor = {
      set: (value: any) => {
        testObject._secretValue = value;
      },
      configurable: true
    };

    SpyOn(propertyDescriptor, "set");

    Object.defineProperty(testObject, "property", propertyDescriptor);

    const propertySpy = new PropertySpy(testObject, "property").andCallSetter(
      () => {}
    );

    testObject.property = "something";

    Expect(propertyDescriptor.set).not.toHaveBeenCalled();
  }

  @Test()
  public propertySpyIsReturned() {
    const testObject: any = {};

    const propertyDescriptor = {
      set: (value: any) => {
        testObject._secretValue = value;
      },
      configurable: true
    };

    SpyOn(propertyDescriptor, "set");

    Object.defineProperty(testObject, "property", propertyDescriptor);

    const propertySpy = new PropertySpy(testObject, "property");

    Expect(propertySpy.andCallSetter(() => {})).toBe(propertySpy);
  }

  @TestCase(null)
  @TestCase(undefined)
  @TestCase(42)
  @TestCase("something")
  @TestCase({ an: "object" })
  @TestCase(["an", "array"])
  public newValueIsSet(expectedValue: any) {
    const testObject: any = {};

    const propertyDescriptor = {
      configurable: true,
      get: () => testObject._secretValue,
      set: (value: any) => {}
    };

    SpyOn(propertyDescriptor, "set");

    Object.defineProperty(testObject, "property", propertyDescriptor);

    const propertySpy = new PropertySpy(testObject, "property").andCallSetter(
      (value: any) => {
        testObject._secretValue = value;
      }
    );

    testObject.property = expectedValue;

    Expect(testObject.property).toBe(expectedValue);
  }

  @TestCase(null, ["an", "array"])
  @TestCase(undefined, { an: "object" })
  @TestCase(42, "something")
  @TestCase("something", 42)
  @TestCase({ an: "object" }, undefined)
  @TestCase(["an", "array"], null)
  public andCallSetterValueIsReturnedWhenReturnValueIsCalledPreviously(
    setterValue: any,
    andReturnValue: any
  ) {
    const testObject: any = {};

    const propertyDescriptor = {
      configurable: true,
      get: () => testObject._secretValue,
      set: (value: any) => {}
    };

    SpyOn(propertyDescriptor, "set");

    Object.defineProperty(testObject, "property", propertyDescriptor);

    const propertySpy = new PropertySpy(testObject, "property")
      .andReturnValue(andReturnValue)
      .andCallSetter((value: any) => {
        testObject._secretValue = value;
      });

    testObject.property = setterValue;

    Expect(testObject.property).toBe(setterValue);
  }

  @TestCase(null, ["an", "array"])
  @TestCase(undefined, { an: "object" })
  @TestCase(42, "something")
  @TestCase("something", 42)
  @TestCase({ an: "object" }, undefined)
  @TestCase(["an", "array"], null)
  public andReturnValueValueIsReturnedWhenReturnValueIsCalledAfter(
    setterValue: any,
    andReturnValue: any
  ) {
    const testObject: any = {};

    const propertyDescriptor = {
      configurable: true,
      get: () => testObject._secretValue,
      set: (value: any) => {}
    };

    SpyOn(propertyDescriptor, "set");

    Object.defineProperty(testObject, "property", propertyDescriptor);

    const propertySpy = new PropertySpy(testObject, "property")
      .andCallSetter((value: any) => {
        testObject._secretValue = value;
      })
      .andReturnValue(andReturnValue);

    testObject.property = setterValue;

    Expect(testObject.property).toBe(andReturnValue);
  }
}
