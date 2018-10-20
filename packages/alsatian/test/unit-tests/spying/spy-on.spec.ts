import { Expect, SpyOn, Test, TestCase } from "../../../core/alsatian-core";

export class SpyOnTests {
  @Test()
  public functionIsReplacedWithSpy() {
    const object = {
      function: () => {}
    };

    const originalFunction = object.function;

    SpyOn(object, "function");

    Expect(object.function).not.toBe(originalFunction);
  }

  @Test()
  public functionStillWorks() {
    const object = {
      function: () => {
        object.functionCalled = true;
      },
      functionCalled: false
    };

    const originalFunction = object.function;

    SpyOn(object, "function");
    object.function();

    Expect(object.functionCalled).toBe(true);
  }

  @Test()
  public callsPropertyIsSetOnFunction() {
    const object = {
      function: () => {}
    };

    const originalFunction = object.function;

    SpyOn(object, "function");

    Expect((object.function as any).calls).toBeDefined();
    Expect((object.function as any).calls).not.toBeNull();
  }

  @Test()
  public spyShouldBeReturned() {
    const object = {
      function: () => {}
    };

    const originalFunction = object.function;

    const spy = SpyOn(object, "function");

    Expect(spy).toBeDefined();
    Expect(spy).not.toBeNull();
  }

  @TestCase("undefined", undefined)
  @TestCase("null", null)
  @TestCase("number", 42)
  @TestCase("string", "something")
  public spyingOnNonFunctionShouldThrowError(
    propertyName: string,
    propertyValue: any
  ) {
    const object: { [propertyName: string]: any } = {};

    object[propertyName] = propertyValue;

    Expect(() => SpyOn(object, propertyName)).toThrowError(
      TypeError,
      `${propertyName} is not a function.`
    );
  }
}
