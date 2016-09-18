import { PropertySpy } from "../../../../core/_spying";
import { Expect, Test, TestCase, SpyOn, FocusTests } from "../../../../core/alsatian-core";

@FocusTests
export class RestoreTests {

  @Test()
  public targetsPropertyIsNoLongerASpyWhenCalledFromSpy() {
    let object = {
      get originalProperty(): any { return null; }
    };

    let originalPropertyGetter = Object.getOwnPropertyDescriptor(object, "originalProperty").get;

    let spy = new PropertySpy(object, "originalProperty");

    Expect(Object.getOwnPropertyDescriptor(object, "originalProperty").get).not.toBe(originalPropertyGetter);

    spy.restore();

    Expect(Object.getOwnPropertyDescriptor(object, "originalProperty").get).toBe(originalPropertyGetter);
  }

    @Test()
    public targetsPropertyIsNoLongerASpyWhenCalledFromProperty() {
      let object = {
        get originalProperty(): any { return null; }
      };

      let originalProperty = object.originalProperty;

      new PropertySpy(object, "originalProperty");

      Expect(object.originalProperty).not.toBe(originalProperty);

      (object.originalProperty as any).restore();

      Expect(object.originalProperty).toBe(originalProperty);
    }

  @Test()
  public targetsOriginalPropertyIsCalledAfterRestoreIsCalled() {
    let object: any = { };
    object.originalProperty = () => {};

    let originalSpy = new PropertySpy(object, "originalProperty");

    let secondSpy = new PropertySpy(object, "originalProperty");

    object.originalProperty.restore();
    object.originalProperty();

    Expect(originalSpy).toHaveBeenCalled();
    Expect(secondSpy).not.toHaveBeenCalled();
  }
}
