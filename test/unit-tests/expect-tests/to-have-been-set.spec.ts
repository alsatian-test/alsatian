import { PropertySetMatchError } from "../../../core/_errors";
import { Expect, Test, SpyOnProperty } from "../../../core/alsatian-core";

@FocusTests
export class ToHaveBeenSetTests {

   @Test()
   public propertySetPasses() {
      const some = {
         set property(value: any) {}
      };

      const propertySpy = SpyOnProperty(some, "property");

      some.property = "something";

      Expect(() => Expect(propertySpy).toHaveBeenSet()).not.toThrow();
   }

   @Test()
   public propertyNotSetFails() {
      const some = {
         set property(value: any) {}
      };

      const propertySpy = SpyOnProperty(some, "property");

      Expect(() => Expect(propertySpy).toHaveBeenSet()).toThrow();
   }

   @Test()
   public propertyNotSetFailsWithCorrectError() {
      const some = {
         set property(value: any) {}
      };

      const propertySpy = SpyOnProperty(some, "property");

      Expect(() => Expect(propertySpy).toHaveBeenSet()).toThrowError(PropertySetMatchError, "Expected property to be set.");
   }

   @Test()
   public propertyNotSetPassesWhenShouldNotCall() {
      const some = {
         set property(value: any) {}
      };

      const propertySpy = SpyOnProperty(some, "property");

      Expect(() => Expect(propertySpy).not.toHaveBeenSet()).not.toThrow();
   }

   @Test()
   public propertySetButShouldNotBeThrowsError() {
      const some = {
         set property(value: any) {}
      };

      const propertySpy = SpyOnProperty(some, "property");

      some.property = "something";

      Expect(() => Expect(propertySpy).not.toHaveBeenSet()).toThrow();
   }


   @Test()
   public propertySetButShouldNotBeThrowsCorrectError() {
      const some = {
         set property(value: any) {}
      };

      const propertySpy = SpyOnProperty(some, "property");

      some.property = "something";

      Expect(() => Expect(propertySpy).not.toHaveBeenSet()).toThrowError(PropertySetMatchError, "Expected property not to be set.");
   }
}
