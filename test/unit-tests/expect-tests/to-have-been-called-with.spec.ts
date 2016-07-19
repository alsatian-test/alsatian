import { FunctionCallMatchError } from "../../../core/errors/function-call-match-error";
import { Expect, Test, TestCase, SpyOn } from "../../../core/alsatian-core";

export class ToHaveBeenCalledWithTests {

  @Test()
  public functionCalledPasses() {
    let some = {
      function: () => {}
    };

    SpyOn(some, "function");

    some.function();

    Expect(() => Expect(some.function).toHaveBeenCalledWith()).not.toThrow();
  }

  @Test()
  public functionNotCalledFails() {
    let some = {
      function: () => {}
    };

    SpyOn(some, "function");

    Expect(() => Expect(some.function).toHaveBeenCalledWith()).toThrow();
  }

  @Test()
  public functionNotCalledFailsWithCorrectError() {
    let some = {
      function: () => {}
    };

    SpyOn(some, "function");

    Expect(() => Expect(some.function).toHaveBeenCalledWith()).toThrowError(FunctionCallMatchError, "Expected function to be called with [].");
  }

  @TestCase([1])
  @TestCase(["argument"])
  @TestCase([1, "argument"])
  @TestCase(["argument", 1])
  public functionCalledWithCorrectArgumentsPasses(expectedArguments: Array<any>) {
    let some = {
      function: () => {}
    };

    SpyOn(some, "function");

    some.function.apply(some, expectedArguments);

    Expect(() => {
      let matcher = Expect(some.function);
      matcher.toHaveBeenCalledWith.apply(matcher, expectedArguments);
    }).not.toThrow();
  }

  @TestCase(["1"], [1])
  @TestCase([1], ["1"])
  @TestCase(["42"], [42])
  @TestCase([42], ["42"])
  @TestCase([1, "42"], [1, 42])
  @TestCase([1, 42], [1, "42"])
  @TestCase([1, "42"], ["1", 42])
  @TestCase(["1", 42], [1, "42"])
  @TestCase(["1", "42"], [1, 42])
  @TestCase([1, 42], ["1", "42"])
  public functionCalledWithSimilarArgumentsFailsWithCorrectError(expectedArguments: Array<any>, actualArguments: Array<any>) {
    let some = {
      function: () => {}
    };

    SpyOn(some, "function");

    some.function.apply(some, actualArguments);

    Expect(() => {
      let matcher = Expect(some.function);
      matcher.toHaveBeenCalledWith.apply(matcher, expectedArguments);
    }).toThrowError(FunctionCallMatchError, "Expected function to be called with [" + expectedArguments.map(arg => JSON.stringify(arg)).join(", ") + "].");
  }

  @TestCase([], [1])
  @TestCase([1], [])
  @TestCase([], ["argument"])
  @TestCase(["argument"], [])
  @TestCase([1], [1, 42])
  @TestCase([42], [1, 42])
  @TestCase([], [1, 42])
  @TestCase([42, 1], [])
  public functionCalledWithWrongNumberOfArgumentsFailsWithCorrectError(expectedArguments: Array<any>, actualArguments: Array<any>) {
    let some = {
      function: () => {}
    };

    SpyOn(some, "function");

    some.function.apply(some, actualArguments);

    Expect(() => {
      let matcher = Expect(some.function);
      matcher.toHaveBeenCalledWith.apply(matcher, expectedArguments);
    }).toThrowError(FunctionCallMatchError, "Expected function to be called with [" + expectedArguments.map(arg => JSON.stringify(arg)).join(", ") + "].");
  }

  @TestCase(["argument", 1], [1, "argument"])
  @TestCase([1, "argument"], ["argument", 1])
  public functionCalledWithRightArgumentsInWrongOrderFailsWithCorrectError(expectedArguments: Array<any>, actualArguments: Array<any>) {
    let some = {
      function: () => {}
    };

    SpyOn(some, "function");

    some.function.apply(some, actualArguments);

    Expect(() => {
      let matcher = Expect(some.function);
      matcher.toHaveBeenCalledWith.apply(matcher, expectedArguments);
    }).toThrowError(FunctionCallMatchError, "Expected function to be called with [" + expectedArguments.map(arg => JSON.stringify(arg)).join(", ") + "].");
  }

  @Test()
  public functionNotCalledPassesWhenShouldNotCall() {
    let some = {
      function: () => {}
    };

    SpyOn(some, "function");

    Expect(() => Expect(some.function).not.toHaveBeenCalledWith()).not.toThrow();
  }

  @Test()
  public functionThrowsErrorFailsWhenShouldNotThrow() {
    let some = {
      function: () => {}
    };

    SpyOn(some, "function");

    some.function();

    Expect(() => Expect(some.function).not.toHaveBeenCalledWith()).toThrow();
  }

  @Test()
  public functionThrowsErrorFailsWithCorrectError() {
    let some = {
      function: () => {}
    };

    SpyOn(some, "function");

    some.function();

    Expect(() => Expect(some.function).not.toHaveBeenCalledWith()).toThrowError(FunctionCallMatchError, "Expected function not to be called with [].");
  }

  @TestCase(["1"], [1])
  @TestCase([1], ["1"])
  @TestCase(["42"], [42])
  @TestCase([42], ["42"])
  @TestCase([1, "42"], [1, 42])
  @TestCase([1, 42], [1, "42"])
  @TestCase([1, "42"], ["1", 42])
  @TestCase(["1", 42], [1, "42"])
  @TestCase(["1", "42"], [1, 42])
  @TestCase([1, 42], ["1", "42"])
  public functionCalledWithSimilarArgumentsPasses(expectedArguments: Array<any>, actualArguments: Array<any>) {
    let some = {
      function: () => {}
    };

    SpyOn(some, "function");

    some.function.apply(some, actualArguments);

    Expect(() => {
      let matcher = Expect(some.function);
      matcher.not.toHaveBeenCalledWith.apply(matcher, expectedArguments);
    }).not.toThrow();
  }

  @TestCase([], [1])
  @TestCase([1], [])
  @TestCase([], ["argument"])
  @TestCase(["argument"], [])
  @TestCase([1], [1, 42])
  @TestCase([42], [1, 42])
  @TestCase([], [1, 42])
  @TestCase([42, 1], [])
  public functionCalledWithWrongNumberOfArgumentsPasses(expectedArguments: Array<any>, actualArguments: Array<any>) {
    let some = {
      function: () => {}
    };

    SpyOn(some, "function");

    some.function.apply(some, actualArguments);

    Expect(() => {
      let matcher = Expect(some.function);
      matcher.not.toHaveBeenCalledWith.apply(matcher, expectedArguments);
    }).not.toThrow();
  }

  @TestCase(["argument", 1], [1, "argument"])
  @TestCase([1, "argument"], ["argument", 1])
  public functionNotCalledWithRightArgumentsInWrongOrderPasses(expectedArguments: Array<any>, actualArguments: Array<any>) {
    let some = {
      function: () => {}
    };

    SpyOn(some, "function");

    some.function.apply(some, actualArguments);

    Expect(() => {
      let matcher = Expect(some.function);
      matcher.not.toHaveBeenCalledWith.apply(matcher, expectedArguments);
    }).not.toThrow();
  }

  @TestCase([1])
  @TestCase(["argument"])
  @TestCase([1, "argument"])
  @TestCase(["argument", 1])
  public functionNotCalledWithDifferentArgumentsFailsWithCorrectError(expectedArguments: Array<any>) {
    let some = {
      function: () => {}
    };

    SpyOn(some, "function");

    some.function.apply(some, expectedArguments);

    Expect(() => {
      let matcher = Expect(some.function);
      matcher.not.toHaveBeenCalledWith.apply(matcher, expectedArguments);
    }).toThrowError(FunctionCallMatchError, "Expected function not to be called with [" + expectedArguments.map(arg => JSON.stringify(arg)).join(", ") + "].");
  }
}
