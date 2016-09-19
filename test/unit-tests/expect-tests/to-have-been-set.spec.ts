//import { PropertySetMatchError } from "../../../core/_errors";
import { Expect, Test, SpyOnProperty, FocusTests } from "../../../core/alsatian-core";

@FocusTests
export class ToHaveBeenSetTests {

  @Test()
  public propertySetPasses() {
    let some = {
      set property(value: any) {}
    };

    SpyOnProperty(some, "property");

    some.property = "something";

    Expect(() => Expect(some.property).toHaveBeenSet()).not.toThrow();
  }
/*
  @Test()
  public functionNotCalledFails() {
    let some = {
      function: () => {}
    };

    SpyOn(some, "function");

    Expect(() => Expect(some.function).toHaveBeenCalled()).toThrow();
  }

  @Test()
  public functionNotCalledFailsWithCorrectError() {
    let some = {
      function: () => {}
    };

    SpyOn(some, "function");

    Expect(() => Expect(some.function).toHaveBeenCalled()).toThrowError(FunctionCallMatchError, "Expected function to be called.");
  }

  @Test()
  public functionNotCalledPassesWhenShouldNotCall() {
    let some = {
      function: () => {}
    };

    SpyOn(some, "function");

    Expect(() => Expect(some.function).not.toHaveBeenCalled()).not.toThrow();
  }

  @Test()
  public functionThrowsErrorFailsWhenShouldNotThrow() {
    let some = {
      function: () => {}
    };

    SpyOn(some, "function");

    some.function();

    Expect(() => Expect(some.function).not.toHaveBeenCalled()).toThrow();
  }

  @Test()
  public functionThrowsErrorFailsWithCorrectError() {
    let some = {
      function: () => {}
    };

    SpyOn(some, "function");

    some.function();

    Expect(() => Expect(some.function).not.toHaveBeenCalled()).toThrowError(FunctionCallMatchError, "Expected function not to be called.");
}*/
}
