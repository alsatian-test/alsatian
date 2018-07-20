import { EmptyMatchError } from "../errors";
import { Matcher } from "./matcher";

/**
 * Compares types that can be empty e.g. string, object and Array
 */
export class EmptyMatcher<T> extends Matcher<T> {
  /**
   * Checks that an array is empty, a string is empty, or an object literal has no properties
   */
  public toBeEmpty() {
    if (null === this.actualValue || undefined === this.actualValue) {
      throw new TypeError(
        "toBeEmpty requires value passed in to Expect not to be null or undefined"
      );
    }

    if (
      typeof this.actualValue !== "string" &&
      !Array.isArray(this.actualValue) &&
      this.actualValue.constructor !== Object &&
      !(this.actualValue instanceof Map)
    ) {
      throw new TypeError(
        "toBeEmpty requires value passed in to Expect to be an array, string, object literal or map"
      );
    }

    if (this.actualValue instanceof Map) {
      if ((this.actualValue.size === 0) !== this.shouldMatch) {
        throw new EmptyMatchError(this.actualValue, this.shouldMatch);
      }
    } else {
      const contents = (this.actualValue as any).length
        ? this.actualValue
        : Object.keys(this.actualValue);

      if (((contents as any).length === 0) !== this.shouldMatch) {
        throw new EmptyMatchError(this.actualValue, this.shouldMatch);
      }
    }
  }
}
