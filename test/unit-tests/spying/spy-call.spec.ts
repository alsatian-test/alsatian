import { SpyCall } from "../../../core/spying/spy-call";
import { Expect, Test, TestCase } from "../../../core/alsatian-core";

export class SpyCallTests {

  @TestCase([])
  @TestCase([ 1 ])
  @TestCase([ 1, 2 ])
  @TestCase([ "one", 2 ])
  @TestCase([ { "some": "thing" }, [] ])
  public spyCallArgsAreSameAsInput(args: Array<any>) {
    let spyCall = new SpyCall(args);

    Expect(spyCall.args).toBe(args);
  }
}
