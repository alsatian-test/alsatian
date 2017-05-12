import { Expect, FocusTests, SpyOnProperty, Test, TestCase } from "../../../core/alsatian-core";
import { PropertySetMatchError } from "../../../core/errors";

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

      Expect(() => Expect(propertySpy).toHaveBeenSetTo("something"))
        .toThrowError(PropertySetMatchError, "Expected property to be set to \"something\".");
   }

   @TestCase(undefined)
   @TestCase(null)
   @TestCase(0)
   @TestCase(42)
   @TestCase(4.2)
   @TestCase(-4.2)
   @TestCase("")
   @TestCase("value")
   @TestCase({ an: "object" })
   @TestCase([ "an", "array" ])
   public propertySetToCorrectValuePasses(expectedValue: any) {
      const some = {
         set property(value: any) {}
      };

      const propertySpy = SpyOnProperty(some, "property");

      some.property = expectedValue;

      Expect(() => Expect(propertySpy).toHaveBeenSetTo(expectedValue)).not.toThrow();
   }

   @TestCase(undefined, [ "an", "array" ])
   @TestCase(null, { an: "object" })
   @TestCase(0, "value")
   @TestCase(42, "")
   @TestCase(4.2, -4.2)
   @TestCase(-4.2, 4.2)
   @TestCase("", 0)
   @TestCase("value", null)
   @TestCase({ an: "object" }, undefined)
   @TestCase([ "an", "array" ], "something completely different")
   public functionCalledWithSimilarArgumentsFailsWithCorrectError(expectedValue: any, actualValue: any) {
      const some = {
         set property(value: any) {}
      };

      const propertySpy = SpyOnProperty(some, "property");

      some.property = actualValue;

      Expect(() => Expect(propertySpy).toHaveBeenSetTo(expectedValue))
        .toThrowError(PropertySetMatchError, `Expected property to be set to ${JSON.stringify(expectedValue)}.`);
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
   @TestCase({ an: "object" })
   @TestCase([ "an", "array" ])
   public propertySetWhenShouldNotBeSetThrowsCorrectError(expectedValue: any) {
      const some = {
         set property(value: any) {}
      };

      const propertySpy = SpyOnProperty(some, "property");

      some.property = expectedValue;

      Expect(() => Expect(propertySpy).not.toHaveBeenSetTo(expectedValue))
        .toThrowError(PropertySetMatchError, `Expected property not to be set to ${JSON.stringify(expectedValue)}.`);
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

      Expect(() => Expect(propertySpy).toHaveBeenSetTo(expectedValue))
        .toThrowError(PropertySetMatchError, `Expected property to be set to ${JSON.stringify(expectedValue)}.`);
   }

   @TestCase(undefined)
   @TestCase(null)
   @TestCase(0)
   @TestCase(1)
   @TestCase(42)
   @TestCase({})
   @TestCase({ an: "object"})
   @TestCase([])
   @TestCase([ "an", "array" ])
   @TestCase(() => {})
   @TestCase((thisCouldBe: any) => "function")
   public checkingWhetherNonPropertySpyHasBeenSetToAValueShouldThrow(actualValue: any) {
      const some = {
         set property(value: any) {}
      };

      const propertySpy = SpyOnProperty(some, "property");
      const EXPECT = Expect(propertySpy);
     (EXPECT as any).actualValue = actualValue;

      Expect(() => EXPECT.toHaveBeenSetTo("something"))
        .toThrowError(TypeError, "toHaveBeenSetTo requires value passed in to Expect to be a PropertySpy.");
   }

   @TestCase(undefined)
   @TestCase(null)
   @TestCase(0)
   @TestCase(1)
   @TestCase(42)
   @TestCase({})
   @TestCase({ an: "object"})
   @TestCase([])
   @TestCase([ "an", "array" ])
   @TestCase(() => {})
   @TestCase((thisCouldBe: any) => "function")
   public checkingWhetherNonPropertySpyHasNotBeenSetToAValueShouldThrow(actualValue: any) {
      const some = {
         set property(value: any) {}
      };

      const propertySpy = SpyOnProperty(some, "property");
      const EXPECT = Expect(propertySpy);
     (EXPECT as any).actualValue = actualValue;

      Expect(() => EXPECT.not.toHaveBeenSetTo("something"))
        .toThrowError(TypeError, "toHaveBeenSetTo requires value passed in to Expect to be a PropertySpy.");
   }

   @TestCase([null])
   @TestCase([[], []])
   @TestCase([1, 2, 3])
   @TestCase(["something", "and", "another", "thing"])
   @TestCase(["this", "or", "this", "or", "that", "other", "thing"])
   public actualValueAndShouldMatchShouldBeSetToPropertyWasNotSetToValue(values: Array<any>) {

      const some = {
         set property(value: any) {}
      };

      const propertySpy = SpyOnProperty(some, "property");

      values.forEach(value => {
         some.property = value;
      });

      let propertyError: PropertySetMatchError;

      try {
         Expect(propertySpy).toHaveBeenSetTo({ something: "weird" });
      }
      catch (error) {
         propertyError = error;
      }

      Expect(propertyError).toBeDefined();
      Expect(propertyError).not.toBeNull();
      Expect(propertyError.actual)
        .toBe("property was set to " + values.map(value => JSON.stringify(value)).join(", ") + ".");
   }

   @TestCase([null])
   @TestCase([[], []])
   @TestCase([1, 2, 3])
   @TestCase(["something", "and", "another", "thing"])
   @TestCase(["this", "or", "this", "or", "that", "other", "thing"])
   public actualValueAndShouldNotMatchShouldBeSetToPropertyWasSetToValue(values: Array<any>) {
      const some = {
         set property(value: any) {}
      };

      const propertySpy = SpyOnProperty(some, "property");

      values.forEach(value => {
         some.property = value;
      });

      let propertyError: PropertySetMatchError;

      try {
         Expect(propertySpy).not.toHaveBeenSetTo(values[0]);
      }
      catch (error) {
         propertyError = error;
      }

      Expect(propertyError).toBeDefined();
      Expect(propertyError).not.toBeNull();
      Expect(propertyError.actual)
        .toBe("property was set to " + values.map(value => JSON.stringify(value)).join(", ") + ".");
   }

   @TestCase(undefined)
   @TestCase(null)
   @TestCase(0)
   @TestCase(1)
   @TestCase(42)
   @TestCase({})
   @TestCase({ an: "object"})
   @TestCase([])
   @TestCase([ "an", "array" ])
   @TestCase(() => {})
   @TestCase((thisCouldBe: any) => "function")
   public expectedValueAndShouldMatchShouldBeSetToPropertyToBeSetToValue(expectedValue: any) {
      const some = {
         set property(value: any) {}
      };

      const propertySpy = SpyOnProperty(some, "property");

      let propertyError: PropertySetMatchError;

      try {
         Expect(propertySpy).toHaveBeenSetTo(expectedValue);
      }
      catch (error) {
         propertyError = error;
      }

      Expect(propertyError).toBeDefined();
      Expect(propertyError).not.toBeNull();
      Expect(propertyError.expected).toBe("property to be set to " + JSON.stringify(expectedValue) + ".");
   }

   @TestCase(undefined)
   @TestCase(null)
   @TestCase(0)
   @TestCase(1)
   @TestCase(42)
   @TestCase({})
   @TestCase({ an: "object"})
   @TestCase([])
   @TestCase([ "an", "array" ])
   @TestCase(() => {})
   @TestCase((thisCouldBe: any) => "function")
   public expectedValueAndShouldNotMatchShouldBeSetToPropertyNotToBeSetToValue(expectedValue: any) {
      const some = {
         set property(value: any) {}
      };

      const propertySpy = SpyOnProperty(some, "property");

      some.property = expectedValue;

      let propertyError: PropertySetMatchError;

      try {
         Expect(propertySpy).not.toHaveBeenSetTo(expectedValue);
      }
      catch (error) {
         propertyError = error;
      }

      Expect(propertyError).toBeDefined();
      Expect(propertyError).not.toBeNull();
      Expect(propertyError.expected).toBe("property not to be set to " + JSON.stringify(expectedValue) + ".");
   }
}
