import { PropertySetMatchError } from "../../../core/errors/property-set-match-error";
import { Expect, Test, TestCase, FocusTests } from "../../../core/alsatian-core";

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
}
