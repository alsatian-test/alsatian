import { PropertySetMatchError } from "../../../core/errors/property-set-match-error";
import { Expect, Test, TestCase } from "../../../core/alsatian-core";

export class PropertySetMatchErrorTests {

   @Test()
   public shouldBeSetMessage() {
      const fakePropertySpy: any = { setCalls: [ ] };

      const error = new PropertySetMatchError(fakePropertySpy, true);

      Expect(error.message).toBe("Expected property to be set.");
   }

   @Test()
   public shouldNotBeSetMessage() {
      const fakePropertySpy: any = { setCalls: [ ] };

      fakePropertySpy.setCalls.push({ args: [] });

      const error = new PropertySetMatchError(fakePropertySpy, false);

      Expect(error.message).toBe("Expected property not to be set.");
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
   public shouldBeSetToValueMessage(value: any) {
      const fakePropertySpy: any = { setCalls: [ ] };

      fakePropertySpy.setCalls.push({ args: [] });

      const error = new PropertySetMatchError(fakePropertySpy, true, value);

      Expect(error.message).toBe(`Expected property to be set to ${JSON.stringify(value)}.`);
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
   public shouldNotBeSetToValueMessage(value: any) {
      const fakePropertySpy: any = { setCalls: [ ] };

      fakePropertySpy.setCalls.push({ args: [] });

      const error = new PropertySetMatchError(fakePropertySpy, false, value);

      Expect(error.message).toBe(`Expected property not to be set to ${JSON.stringify(value)}.`);
   }

   @Test()
   public actualValueAndShouldMatchShouldBeSetToPropertyNotSet() {
      const fakePropertySpy: any = { setCalls: [ ] };

      fakePropertySpy.setCalls.push({ args: [] });

      let error = new PropertySetMatchError(fakePropertySpy, true);

      Expect(error.actualValue).toBe("property was not set.");
   }

   @Test()
   public actualValueAndShouldNotMatchShouldBeSetToPropertySet() {
      const fakePropertySpy: any = { setCalls: [ ] };

      fakePropertySpy.setCalls.push({ args: [] });

      let error = new PropertySetMatchError(fakePropertySpy, false);

      Expect(error.actualValue).toBe("property was set.");
   }

   @Test()
   public expectedValueAndShouldMatchShouldBeSetToPropertyToBeSet() {
      const fakePropertySpy: any = { setCalls: [ ] };

      fakePropertySpy.setCalls.push({ args: [] });

      let error = new PropertySetMatchError(fakePropertySpy, true);

      Expect(error.expectedValue).toBe("property to be set.");
   }

   @Test()
   public expectedValueAndShouldNotMatchShouldBeSetToFunctionNotToBeCalled() {
      const fakePropertySpy: any = { setCalls: [ ] };

      fakePropertySpy.setCalls.push({ args: [] });

      let error = new PropertySetMatchError(fakePropertySpy, false);

      Expect(error.expectedValue).toBe("property not to be set.");
   }

   @TestCase([null])
   @TestCase([[], []])
   @TestCase([1, 2, 3])
   @TestCase(["something", "and", "another", "thing"])
   @TestCase(["this", "or", "this", "or", "that", "other", "thing"])
   public actualValueAndShouldMatchShouldBeSetToPropertyWasNotSetToValue(values: Array<any>) {
      const fakePropertySpy: any = { setCalls: [ ] };

      values.forEach(value => {
         fakePropertySpy.setCalls.push({ args: [ value ] });
      });

      let error = new PropertySetMatchError(fakePropertySpy, true, 42);

      Expect(error.actualValue).toBe("property was set to " + values.map(value => JSON.stringify(value)).join(", ") + ".");
   }

   @TestCase([null])
   @TestCase([[], []])
   @TestCase([1, 2, 3])
   @TestCase(["something", "and", "another", "thing"])
   @TestCase(["this", "or", "this", "or", "that", "other", "thing"])
   public actualValueAndShouldNotMatchShouldBeSetToPropertyWasSetToValue(values: Array<any>) {
      const fakePropertySpy: any = { setCalls: [ ] };

      values.forEach(value => {
         fakePropertySpy.setCalls.push({ args: [ value ] });
      });

      let error = new PropertySetMatchError(fakePropertySpy, false, 42);

      Expect(error.actualValue).toBe("property was set to " + values.map(value => JSON.stringify(value)).join(", ") + ".");
   }

   @TestCase(undefined)
   @TestCase(null)
   @TestCase(0)
   @TestCase(1)
   @TestCase(42)
   @TestCase({})
   @TestCase({ "an": "object"})
   @TestCase([])
   @TestCase([ "an", "array" ])
   @TestCase(() => {})
   @TestCase((thisCouldBe: any) => "function")
   public expectedValueAndShouldMatchShouldBeSetToPropertyToBeSetToValue(value: any) {
      const fakePropertySpy: any = { setCalls: [ ] };

      let error = new PropertySetMatchError(fakePropertySpy, true, value);

      Expect(error.expectedValue).toBe("property to be set to " + JSON.stringify(value) + ".");
   }

   @TestCase(undefined)
   @TestCase(null)
   @TestCase(0)
   @TestCase(1)
   @TestCase(42)
   @TestCase({})
   @TestCase({ "an": "object"})
   @TestCase([])
   @TestCase([ "an", "array" ])
   @TestCase(() => {})
   @TestCase((thisCouldBe: any) => "function")
   public expectedValueAndShouldNotMatchShouldBeSetToPropertyNotToBeSetToValue(value: any) {
      const fakePropertySpy: any = { setCalls: [ ] };

      let error = new PropertySetMatchError(fakePropertySpy, false, value);

      Expect(error.expectedValue).toBe("property not to be set to " + JSON.stringify(value) + ".");
   }
}
