import { Expect, Test, TestCase, SpyOn } from "../../../core/alsatian-core";

export class SpyOnTests {

  @Test()
  public functionIsReplacedWithSpy() {
    let object = {
      function: () => {}
    };

    let originalFunction = object.function;

    SpyOn(object, "function");

    Expect(object.function).not.toBe(originalFunction);
  }

  @Test()
  public functionStillWorks() {
    let object = {
      functionCalled: false,
      function: () => {
        object.functionCalled = true;
      }
    };

    let originalFunction = object.function;

    SpyOn(object, "function");
    object.function();

    Expect(object.functionCalled).toBe(true);
  }
}
