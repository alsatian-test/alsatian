import { Expect, TestCase } from "../../../../core/alsatian-core";
import { TypeMatcher } from "../../../../core/spying/type-matcher";

/* tslint:disable:no-construct */
export class TypeMatcherTestFunctionTests {

   @TestCase(0)
   @TestCase(1)
   @TestCase(42)
   @TestCase(-42)
   @TestCase(new Number(0))
   @TestCase(new Number(1))
   @TestCase(new Number(42))
   @TestCase(new Number(-42))
   public numberTypeAndNumberValueReturnsTrue(value: number | Number) {
      const matcher = new TypeMatcher(Number);
      Expect(matcher.test(value)).toBe(true);
   }

   @TestCase(undefined)
   @TestCase(null)
   @TestCase("")
   @TestCase(new String(""))
   @TestCase("test")
   @TestCase(new String("test"))
   @TestCase(true)
   @TestCase(false)
   @TestCase(new Boolean(true))
   @TestCase(new Boolean(false))
   @TestCase({})
   @TestCase({ an: "object"})
   @TestCase(new Object({}))
   @TestCase(new Object({ an: "object"}))
   @TestCase([])
   @TestCase([ "an", "array" ])
   @TestCase(new Array([]))
   @TestCase(new Array([ "an", "array" ]))
   @TestCase(new Error())
   @TestCase(new Error("something went wrong"))
   public numberTypeAndNonNumberValueReturnsTrue(value: any) {
      const matcher = new TypeMatcher(Number);
      Expect(matcher.test(value)).toBe(false);
   }

   @TestCase("")
   @TestCase(new String(""))
   @TestCase("test")
   @TestCase(new String("test"))
   public stringTypeAndStringValueReturnsTrue(value: string | String) {
      const matcher = new TypeMatcher(String);
      Expect(matcher.test(value)).toBe(true);
   }

   @TestCase(undefined)
   @TestCase(null)
   @TestCase(0)
   @TestCase(1)
   @TestCase(42)
   @TestCase(-42)
   @TestCase(new Number(0))
   @TestCase(new Number(1))
   @TestCase(new Number(42))
   @TestCase(new Number(-42))
   @TestCase(true)
   @TestCase(false)
   @TestCase(new Boolean(true))
   @TestCase(new Boolean(false))
   @TestCase({})
   @TestCase({ an: "object"})
   @TestCase(new Object({}))
   @TestCase(new Object({ an: "object"}))
   @TestCase([])
   @TestCase([ "an", "array" ])
   @TestCase(new Array([]))
   @TestCase(new Array([ "an", "array" ]))
   @TestCase(new Error())
   @TestCase(new Error("something went wrong"))
   public stringTypeAndNonStringValueReturnsTrue(value: any) {
      const matcher = new TypeMatcher(String);
      Expect(matcher.test(value)).toBe(false);
   }

   @TestCase(true)
   @TestCase(false)
   @TestCase(new Boolean(true))
   @TestCase(new Boolean(false))
   public booleanTypeAndBooleanValueReturnsTrue(value: boolean | Boolean) {
      const matcher = new TypeMatcher(Boolean);
      Expect(matcher.test(value)).toBe(true);
   }

   @TestCase(undefined)
   @TestCase(null)
   @TestCase(0)
   @TestCase(1)
   @TestCase(42)
   @TestCase(-42)
   @TestCase("")
   @TestCase(new String(""))
   @TestCase("test")
   @TestCase(new String("test"))
   @TestCase(new Number(0))
   @TestCase(new Number(1))
   @TestCase(new Number(42))
   @TestCase(new Number(-42))
   @TestCase({})
   @TestCase({ an: "object"})
   @TestCase(new Object({}))
   @TestCase(new Object({ an: "object"}))
   @TestCase([])
   @TestCase([ "an", "array" ])
   @TestCase(new Array([]))
   @TestCase(new Array([ "an", "array" ]))
   @TestCase(new Error())
   @TestCase(new Error("something went wrong"))
   public booleanTypeAndNonBooleanValueReturnsTrue(value: any) {
      const matcher = new TypeMatcher(Boolean);
      Expect(matcher.test(value)).toBe(false);
   }

   @TestCase(new Number(0))
   @TestCase(new Number(1))
   @TestCase(new Number(42))
   @TestCase(new Number(-42))
   @TestCase(new String("test"))
   @TestCase(new String(""))
   @TestCase(new Boolean(true))
   @TestCase(new Boolean(false))
   @TestCase(new Object({}))
   @TestCase(new Object({ an: "object"}))
   @TestCase(new Array([]))
   @TestCase(new Array([ "an", "array" ]))
   @TestCase(new Error())
   @TestCase(new Error("something went wrong"))
   public objectTypeAndObjectValueReturnsTrue(value: Object) {
      const matcher = new TypeMatcher(Object);
      Expect(matcher.test(value)).toBe(true);
   }

   @TestCase(undefined)
   @TestCase(null)
   @TestCase(0)
   @TestCase(1)
   @TestCase(42)
   @TestCase(-42)
   @TestCase("")
   @TestCase("test")
   @TestCase(true)
   @TestCase(false)
   public objectTypeAndNonObjectValueReturnsTrue(value: any) {
      const matcher = new TypeMatcher(Object);
      Expect(matcher.test(value)).toBe(false);
   }

   @TestCase(new Array([]))
   @TestCase(new Array([ "an", "array" ]))
   public arrayTypeAndArrayValueReturnsTrue(value: Array<any>) {
      const matcher = new TypeMatcher(Array);
      Expect(matcher.test(value)).toBe(true);
   }

   @TestCase(undefined)
   @TestCase(null)
   @TestCase(0)
   @TestCase(1)
   @TestCase(42)
   @TestCase(-42)
   @TestCase(new Number(0))
   @TestCase(new Number(1))
   @TestCase(new Number(42))
   @TestCase(new Number(-42))
   @TestCase("")
   @TestCase("test")
   @TestCase(new String("test"))
   @TestCase(new String(""))
   @TestCase(true)
   @TestCase(false)
   @TestCase(new Boolean(true))
   @TestCase(new Boolean(false))
   @TestCase(new Object({}))
   @TestCase(new Object({ an: "object"}))
   @TestCase(new Error())
   @TestCase(new Error("something went wrong"))
   public arrayTypeAndNonArrayValueReturnsTrue(value: any) {
      const matcher = new TypeMatcher(Array);
      Expect(matcher.test(value)).toBe(false);
   }

   @TestCase(new Error())
   @TestCase(new Error("something went wrong"))
   public errorTypeAndArrayValueReturnsTrue(value: Error) {
      const matcher = new TypeMatcher(Error);
      Expect(matcher.test(value)).toBe(true);
   }

   @TestCase(undefined)
   @TestCase(null)
   @TestCase(0)
   @TestCase(1)
   @TestCase(42)
   @TestCase(-42)
   @TestCase(new Number(0))
   @TestCase(new Number(1))
   @TestCase(new Number(42))
   @TestCase(new Number(-42))
   @TestCase("")
   @TestCase("test")
   @TestCase(new String("test"))
   @TestCase(new String(""))
   @TestCase(true)
   @TestCase(false)
   @TestCase(new Boolean(true))
   @TestCase(new Boolean(false))
   @TestCase(new Object({}))
   @TestCase(new Object({ an: "object"}))
   @TestCase(new Array([]))
   @TestCase(new Array([ "an", "array" ]))
   public errorTypeAndNonErrorValueReturnsTrue(value: any) {
      const matcher = new TypeMatcher(Error);
      Expect(matcher.test(value)).toBe(false);
   }
}
