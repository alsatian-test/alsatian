import { Expect, SpyOn, Test, TestCase } from "../../../../core/alsatian-core";
import { PropertySpy } from "../../../../core/spying";

export class RestoreTests {

   @Test()
   public targetsPropertyGetterIsNoLongerASpyWhenCalledFromSpy() {
      const object = {
         get originalProperty(): any { return null; }
      };

      const originalPropertyGetter = Object.getOwnPropertyDescriptor(object, "originalProperty").get;

      const spy = new PropertySpy(object, "originalProperty");

      Expect(Object.getOwnPropertyDescriptor(object, "originalProperty").get).not.toBe(originalPropertyGetter);

      spy.restore();

      Expect(Object.getOwnPropertyDescriptor(object, "originalProperty").get).toBe(originalPropertyGetter);
   }

   @Test()
   public targetsPropertyIsGetterNoLongerASpyWhenCalledFromProperty() {
      let object = {
         get originalProperty(): any { return null; }
      };

      let originalPropertyGetter =  Object.getOwnPropertyDescriptor(object, "originalProperty").get;

      const spy = new PropertySpy(object, "originalProperty");

      Expect(Object.getOwnPropertyDescriptor(object, "originalProperty").get).not.toBe(originalPropertyGetter);

      spy.restore();

      Expect(Object.getOwnPropertyDescriptor(object, "originalProperty").get).toBe(originalPropertyGetter);
   }

   @Test()
   public targetsPropertySetterIsNoLongerASpyWhenCalledFromSpy() {
      const object = {
         set originalProperty(value: any) {}
      };

      const originalPropertySetter = Object.getOwnPropertyDescriptor(object, "originalProperty").set;

      const spy = new PropertySpy(object, "originalProperty");

      Expect(Object.getOwnPropertyDescriptor(object, "originalProperty").set).not.toBe(originalPropertySetter);

      spy.restore();

      Expect(Object.getOwnPropertyDescriptor(object, "originalProperty").set).toBe(originalPropertySetter);
   }

   @Test()
   public targetsPropertyIsSetterNoLongerASpyWhenCalledFromProperty() {
      const object = {
         set originalProperty(value: any) { }
      };

      const originalPropertySetter =  Object.getOwnPropertyDescriptor(object, "originalProperty").set;

      const spy = new PropertySpy(object, "originalProperty");

      Expect(Object.getOwnPropertyDescriptor(object, "originalProperty").set).not.toBe(originalPropertySetter);

      spy.restore();

      Expect(Object.getOwnPropertyDescriptor(object, "originalProperty").set).toBe(originalPropertySetter);
   }
}
