import { SpyCall } from "../../../core/spying/spy-call";
import { Expect, Test, TestCase } from "../../../core/alsatian-core";

export class SpyCallTests {

  @TestCase([])
  @TestCase([ 1 ])
  @TestCase([ 1, 2 ])
  @TestCase([ "one", 2 ])
  @TestCase([ { "some": "thing" }, [] ])
  public spyCallArgsAreSameAsInput(args: Array<any>) {
    const spyCall = new SpyCall(args);

    Expect(spyCall.args).toBe(args);
  }

  @TestCase([ 1 ])
  @TestCase([ "something" ])
  @TestCase([ 1, 2, 3 ])
  @TestCase([ "some", "thing" ])
  @TestCase([ [ "an", "array" ] ])
  @TestCase([ { "an": "object "} ])
  public allArgumentsMatchIfIdenticalInput(expectedArgs: Array<any>) {
    const spyCall = new SpyCall(expectedArgs);

    Expect(spyCall.allArgumentsMatch.apply(spyCall, expectedArgs)).toBe(true);
  }

  @TestCase([ 1, 2, 3 ], [ 3, 2, 1])
  @TestCase([ "some", "thing" ], [ "thing", "some" ])
  public allArgumentsDoNotMatchIfIdenticalInputInWrongOrder(expectedArgs: Array<any>, actualArguments: Array<any>) {
    const spyCall = new SpyCall(expectedArgs);

    Expect(spyCall.allArgumentsMatch.apply(spyCall, expectedArgs)).toBe(false);
  }

  @TestCase([ 1, 2, 3 ], [ 1, 2 ])
  @TestCase([ "some", "thing" ], [ "thing" ])
  public allArgumentsDoNotMatchIfMissingArguments(expectedArgs: Array<any>, actualArguments: Array<any>) {
    const spyCall = new SpyCall(expectedArgs);

    Expect(spyCall.allArgumentsMatch.apply(spyCall, expectedArgs)).toBe(false);
  }

  @TestCase([ [ "an", "array" ] ], [ [ "an", "array" ] ])
  @TestCase([ { "an": "object "} ], [ { "an": "object "} ])
  public allArgumentsDoNotMatchIfArgumentsAreDifferentInstances(expectedArgs: Array<any>, actualArguments: Array<any>) {
    const spyCall = new SpyCall(expectedArgs);

    Expect(spyCall.allArgumentsMatch.apply(spyCall, expectedArgs)).toBe(false);
  }
}
