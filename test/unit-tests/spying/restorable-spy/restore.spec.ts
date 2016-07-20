import { RestorableSpy } from "../../../../core/spying/restorable-spy";
import { Expect, Test, TestCase, SpyOn } from "../../../../core/alsatian-core";

export class RestoreTests {

  @Test()
  public targetsFunctionIsNoLongerASpyWhenCalledFromSpy() {
    let object = {
      originalFunction: () => {}
    };

    let originalFunction = object.originalFunction;

    let spy = SpyOn(object, "originalFunction");

    Expect(object.originalFunction).not.toBe(originalFunction);

    spy.restore();

    Expect(object.originalFunction).toBe(originalFunction);
  }

    @Test()
    public targetsFunctionIsNoLongerASpyWhenCalledFromFunction() {
      let object = {
        originalFunction: () => {}
      };

      let originalFunction = object.originalFunction;

      SpyOn(object, "originalFunction");

      Expect(object.originalFunction).not.toBe(originalFunction);

      (object.originalFunction as any).restore();

      Expect(object.originalFunction).toBe(originalFunction);
    }

  @Test()
  public targetsOriginalFunctionIsCalledAfterRestoreIsCalled() {
    let object: any = { };
    object.originalFunction = () => {};
    let originalSpy = SpyOn(object, "originalFunction");

    let secondSpy = SpyOn(object, "originalFunction");

    object.originalFunction.restore();
    object.originalFunction();

    Expect(originalSpy).toHaveBeenCalled();
    Expect(secondSpy).not.toHaveBeenCalled();
  }
}
