import { Matcher } from "./matcher";
import { stringify } from "../stringification";

/**
 * Compares types that can be empty e.g. string, object and Array
 */
export class EmptyMatcher<T> extends Matcher<T> {
  /**
   * Checks that an array is empty, a string is empty, or an object literal has no properties
   */
  public toBeEmpty() {

    const actualValue = this.actualValue as any;

    const length = actualValue instanceof Map ?
                   actualValue.size :
                   actualValue.length !== undefined ?
                   actualValue.length :
                   Object.keys(actualValue).length;
    
    this._registerMatcher(
      (length === 0) === this.shouldMatch,
      `Expected "${typeof actualValue === "string" ? actualValue : stringify(this.actualValue)}" ` +
      `${this.shouldMatch ? "" : "not "}to be empty.`,
      this.actualValue
    );
  }
}
