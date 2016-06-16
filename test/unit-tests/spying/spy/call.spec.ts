import { Spy } from "../../../../core/spying/spy";
import { Expect, Test, TestCase, SpyOn } from "../../../../core/alsatian-core";

export class CallTests {

  @TestCase([])
  @TestCase([ 1 ])
  @TestCase([ 1, 2 ])
  @TestCase([ "one", 2 ])
  @TestCase([ { "some": "thing" }, [] ])
  public argumentsRecorded(args: Array<any>) {
    let originalFunction = () => {};

    let spy = new Spy(originalFunction, this);

    spy.call(args);

    Expect(spy.calls[0].args).toBe(args);
  }

  @TestCase(0)
  @TestCase(1)
  @TestCase(42)
  public callAddedForEachCall(callCount: number) {
    let originalFunction = () => {};

    let spy = new Spy(originalFunction, this);

    for (let i = 0; i < callCount; i++ ){
      spy.call([]);
    }

    Expect(spy.calls.length).toBe(callCount);
  }

  @Test()
  public originalFunctionIsCalled() {
    let object = {
      originalFunction: () => {}
    };

    SpyOn(object, "originalFunction");

    let originalFunction = object.originalFunction;

    let spy = new Spy(object.originalFunction, object);

    spy.call([]);

    Expect(originalFunction).toHaveBeenCalled();
  }
}
