import { PropertySetMatchError } from "../errors";
import { PropertySpy } from "../spying";
import { Matcher } from "./matcher";

export class PropertyMatcher<PropertyType> extends Matcher<PropertySpy<PropertyType>> {

    public constructor(actualValue: PropertySpy<PropertyType>) {
        super(actualValue);
    }

   /**
    * Checks that a property spy has been set
    */
   public toHaveBeenSet() {
      if (this.actualValue instanceof PropertySpy === false) {
         throw new TypeError("toHaveBeenSet requires value passed in to Expect to be a PropertySpy.");
      }

      if (this.actualValue.setCalls.length === 0 === this.shouldMatch) {
         throw new PropertySetMatchError(this.actualValue, this.shouldMatch);
      }
   }

   /**
    * Checks that a property spy has been set to a specific value
    * @param value - a value to which the property should be set to
    */
   public toHaveBeenSetTo(value: any) {
      if (this.actualValue instanceof PropertySpy === false) {
         throw new TypeError("toHaveBeenSetTo requires value passed in to Expect to be a PropertySpy.");
      }

      if (this.actualValue.setCalls.filter((call: any) => call.args[0] === value).length === 0 === this.shouldMatch) {
         throw new PropertySetMatchError(this.actualValue, this.shouldMatch, value);
      }
   }
}
