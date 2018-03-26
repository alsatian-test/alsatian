import { SubsetPropertyAssertsDict, AllPropertyAssertsDict } from "./fluent-properties-matcher";
import { FluentMatcherCore } from "./fluent-matcher-core";
import { IFluentMatcherCore } from "./i-fluent-matcher-core";

/**
 * Fluent API for beginning property assertions on complex types (e.g., objects or arrays).
 */
export interface IFluentPropertiesMatcher<T, TParent> {
  /**
   * Ensures the expected object contains the provided subset of property definitions. See https://git.io/vAH9p
   * @param subsetDict A subset of the original object's properties, with assertions for values.
   */
  properties(subsetDict: SubsetPropertyAssertsDict<T>): IFluentMatcherCore<T, TParent>;

  /**
   * Like properties(...) but ensures compile-time errors when properties are missing from the expected
   * value definition. This helps you remember to update your tests when adding properties to your types,
   * in the future. See https://git.io/vAHHs
   * @param dict A dictionary with all properties of T.
   */
  allProperties(dict: AllPropertyAssertsDict<T>): IFluentMatcherCore<T, TParent>;

  /**
   * Checks for the existence of keys on the expected object, without regard for values.
   * @param expectedKeys An array of keys to existence-check.
   */
  keys<K extends keyof T>(
        expectedKeys: Array<K>
      ): IFluentMatcherCore<T, TParent>;

  /**
   * Checks an array for the given values.
   * @param expected The values to existence-check within the expected array.
   */
  elements(expected: Array<any>): IFluentMatcherCore<T, TParent>;    
}