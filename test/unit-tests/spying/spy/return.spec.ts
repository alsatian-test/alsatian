import { Spy } from "../../../../core/spying/spy";
import { Expect, Test, TestCase, SpyOn } from "../../../../core/alsatian-core";

export class ReturnTests {

  @TestCase(undefined)
  @TestCase(null)
  @TestCase(0)
  @TestCase(42)
  @TestCase(4.2)
  @TestCase(-4.2)
  @TestCase("")
  @TestCase("something")
  public givenReturnValueIsReturned(expectedReturnValue: any) {
    let object = {
      originalFunction: () => {}
    };

    SpyOn(object, "originalFunction");

    let originalFunction = object.originalFunction;

    let spy = new Spy(object.originalFunction, object);

    spy.return(expectedReturnValue);

    let actualReturnValue = spy.call([]);

    Expect(actualReturnValue).toBe(expectedReturnValue);
  }
}
