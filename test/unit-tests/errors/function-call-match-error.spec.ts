import { FunctionCallMatchError } from "../../../core/errors/function-call-match-error";
import { Expect, Test, TestCase } from "../../../core/alsatian-core";

export class FunctionCallMatchErrorTests {

  @Test()
  public shouldBeCalledMessage() {
    let fakeFunction: any = { calls: [ ] };

    let error = new FunctionCallMatchError(fakeFunction, true);

    Expect(error.message).toBe("Expected function to be called.");
  }

  @Test()
  public shouldNotBeCalledMessage() {
    let fakeFunction: any = { calls: [ ] };

    fakeFunction.calls.push({ args: [] });

    let error = new FunctionCallMatchError(fakeFunction, false);

    Expect(error.message).toBe("Expected function not to be called.");
  }

  @TestCase([ "this" ])
  @TestCase([ "this", "that" ])
  @TestCase([ 1, 2, 3 ])
  public shouldBeCalledWithArgsMessage(args: Array<any>) {
    let fakeFunction: any = { calls: [ ] };

    fakeFunction.calls.push({ args: [] });

    let error = new FunctionCallMatchError(fakeFunction, true, args);

    Expect(error.message).toBe("Expected function to be called with [" + args.map(arg => JSON.stringify(arg)).join(", ") + "].");
  }

  @TestCase([ "this" ])
  @TestCase([ "this", "that" ])
  @TestCase([ 1, 2, 3 ])
  public shouldNotBeCalledWithArgsMessage(args: Array<any>) {
    let fakeFunction: any = { calls: [ ] };

    fakeFunction.calls.push({ args: args });

    let error = new FunctionCallMatchError(fakeFunction, false, args);

    Expect(error.message).toBe("Expected function not to be called with [" + args.map(arg => JSON.stringify(arg)).join(", ") + "].");
  }
}
