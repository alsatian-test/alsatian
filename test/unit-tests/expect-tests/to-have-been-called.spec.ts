import { FunctionCallMatchError } from "../../../core/errors/function-call-match-error";
import { Expect, Test, SpyOn } from "../../../core/alsatian-core";

export class ToHaveBeenCalledTests {

  @Test()
  public functionCalledPasses() {
    let some = {
      function: () => {}
    };

    SpyOn(some, "function");

    some.function();

    Expect(() => Expect(some.function).toHaveBeenCalled()).not.toThrow();
  }

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

    Expect(() => Expect(some.function).not.toHaveBeenCalled()).toThrow();
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
  }
}
