import { Spy } from "../../../../core/spying/spy";
import { Expect, Test, TestCase, SpyOn, FocusTest } from "../../../../core/alsatian-core";

export class AndCallThroughTests {

  @Test()
  public originalFunctionNotCalledIfSpyStub() {
    let object = {
      originalFunction: () => {}
    };

    SpyOn(object, "originalFunction");

    let originalFunction = object.originalFunction;

    let spy = new Spy(object.originalFunction, object);

    spy.andStub();

    spy.call([]);

    Expect(originalFunction).not.toHaveBeenCalled();
  }

 @Test()
 public originalFunctionCalledIfSpyStubbedThenRestored() {
   let object = {
     originalFunction: () => {}
   };

   SpyOn(object, "originalFunction");

   let originalFunction = object.originalFunction;

   let spy = new Spy(object.originalFunction, object);

   spy.andStub();
   spy.andCallThrough();

   spy.call([]);

   Expect(originalFunction).toHaveBeenCalled();
 }
}
