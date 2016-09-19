import { PropertySetMatchError } from "../../../core/_errors";
import { Expect, Test, TestCase, SpyOnProperty, FocusTests } from "../../../core/alsatian-core";

export class ToHaveBeenSetToTests {

   @Test()
   public propertySetPasses() {
      const some = {
         set property(value: any) {}
      };

      const propertySpy = SpyOnProperty(some, "property");

      some.property = "something";

      Expect(() => Expect(propertySpy).toHaveBeenSetTo("something")).not.toThrow();
   }

   @Test()
   public propertyNotSetFails() {
      const some = {
         set property(value: any) {}
      };

      const propertySpy = SpyOnProperty(some, "property");

      Expect(() => Expect(propertySpy).toHaveBeenSetTo("something")).toThrow();
   }

   @Test()
   public propertyNotSetFailsWithCorrectError() {
      const some = {
         set property(value: any) {}
      };

      const propertySpy = SpyOnProperty(some, "property");

      Expect(() => Expect(propertySpy).toHaveBeenSetTo("something")).toThrowError(PropertySetMatchError, "Expected property to be set to \"something\".");
   }

   @TestCase(undefined)
   @TestCase(null)
   @TestCase(0)
   @TestCase(42)
   @TestCase(4.2)
   @TestCase(-4.2)
   @TestCase("")
   @TestCase("value")
   @TestCase({ "an": "object" })
   @TestCase([ "an", "array" ])
   public propertySetToCorrectValuePasses(value: any) {
      const some = {
         set property(value: any) {}
      };

      const propertySpy = SpyOnProperty(some, "property");

      some.property = value;

      Expect(() => Expect(propertySpy).toHaveBeenSetTo(value)).not.toThrow();
   }

   @TestCase(undefined, [ "an", "array" ])
   @TestCase(null, { "an": "object" })
   @TestCase(0, "value")
   @TestCase(42, "")
   @TestCase(4.2, -4.2)
   @TestCase(-4.2, 4.2)
   @TestCase("", 0)
   @TestCase("value", null)
   @TestCase({ "an": "object" }, undefined)
   @TestCase([ "an", "array" ], "something completely different")
   public functionCalledWithSimilarArgumentsFailsWithCorrectError(expectedValue: any, actualValue: any) {
      const some = {
         set property(value: any) {}
      };

      const propertySpy = SpyOnProperty(some, "property");

      some.property = actualValue;

      Expect(() => Expect(propertySpy).toHaveBeenSetTo(expectedValue)).toThrowError(PropertySetMatchError, `Expected property to be set to ${JSON.stringify(expectedValue)}.`);
   }

   @Test()
   public propertyNotSetPassesWhenShouldNotCall() {
      const some = {
         set property(value: any) {}
      };

      const propertySpy = SpyOnProperty(some, "property");

      Expect(() => Expect(propertySpy).not.toHaveBeenSetTo("something")).not.toThrow();
   }

   @Test()
   public propertySetWhenShouldNotBeSetThrowsError() {
      const some = {
         set property(value: any) {}
      };

      const propertySpy = SpyOnProperty(some, "property");

      some.property = "something";

      Expect(() => Expect(propertySpy).not.toHaveBeenSetTo("something")).toThrow();
   }

   @TestCase(undefined)
   @TestCase(null)
   @TestCase(0)
   @TestCase(42)
   @TestCase(4.2)
   @TestCase(-4.2)
   @TestCase("")
   @TestCase("value")
   @TestCase({ "an": "object" })
   @TestCase([ "an", "array" ])
   public propertySetWhenShouldNotBeSetThrowsCorrectError(value: any) {
      const some = {
         set property(value: any) {}
      };

      const propertySpy = SpyOnProperty(some, "property");

      some.property = value;

      Expect(() => Expect(propertySpy).not.toHaveBeenSetTo(value)).toThrowError(PropertySetMatchError, `Expected property not to be set to ${JSON.stringify(value)}.`);
   }

   @TestCase("1", 1)
   @TestCase(1, "1")
   @TestCase("42", 42)
   @TestCase(42, "42")
   public propertySetToSimilarValuePassesWhenShouldNotBeSet(expectedValue: any, similarValue: any) {
      const some = {
         set property(value: any) {}
      };

      const propertySpy = SpyOnProperty(some, "property");

      some.property = similarValue;

      Expect(() => Expect(propertySpy).not.toHaveBeenSetTo(expectedValue)).not.toThrow();
   }

   @TestCase("1", 1)
   @TestCase(1, "1")
   @TestCase("42", 42)
   @TestCase(42, "42")
   public propertySetToSimilarValueFailsWhenShouldBeSet(expectedValue: any, similarValue: any) {
      const some = {
         set property(value: any) {}
      };

      const propertySpy = SpyOnProperty(some, "property");

      some.property = similarValue;

      Expect(() => Expect(propertySpy).toHaveBeenSetTo(expectedValue)).toThrowError(PropertySetMatchError, `Expected property to be set to ${JSON.stringify(expectedValue)}.`);
   }
}
