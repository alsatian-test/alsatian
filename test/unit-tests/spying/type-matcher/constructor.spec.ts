import { Expect, TestCase } from "../../../../core/alsatian-core";
import { TypeMatcher } from "../../../../core/spying/type-matcher";

export class TypeMatcherConstructorTests {

   @TestCase(null)
   @TestCase(undefined)
   public nullOrUndefinedTypesThrowError(type: any) {
      Expect(() => new TypeMatcher(type)).toThrowError(TypeError, "type must not be null or undefined");
   }

   @TestCase(Number)
   @TestCase(String)
   @TestCase(Boolean)
   @TestCase(Array)
   @TestCase(Object)
   @TestCase(Error)
   public objectTypesDoNotThrow(type: new (...args: Array<any>) => object) {
      Expect(() => new TypeMatcher(type)).not.toThrow();
   }
}
