import { Spy } from "../../../../core/spying/spy";
import { Expect, Test, TestCase, SpyOn } from "../../../../core/alsatian-core";

export class AndCallTests {

  @Test()
  public originalFunctionNotCalledIfSpyFaked() {
    let object = {
      originalFunction: () => {}
    };

    SpyOn(object, "originalFunction");

    let originalFunction = object.originalFunction;

    let spy = new Spy(object.originalFunction, object);

    spy.andCall(() => {});

    spy.call([]);

    Expect(originalFunction).not.toHaveBeenCalled();
  }

 @Test()
 public originalFunctionNotCalledIfSpyNotFaked() {
   let object = {
     originalFunction: () => {}
   };

   SpyOn(object, "originalFunction");

   let originalFunction = object.originalFunction;

   let spy = new Spy(object.originalFunction, object);

   spy.call([]);

   Expect(originalFunction).toHaveBeenCalled();
 }

  @TestCase(() => {})
  @TestCase(() => 1 + 1)
  public fakeFunctionNotCalledIfSpyNotFaked(fakeFunction: Function) {
    let object = {
      originalFunction: () => {}
    };

    let fake = {
      function: fakeFunction
   };

    SpyOn(fake, "function");

    let originalFunction = object.originalFunction;

    let spy = new Spy(object.originalFunction, object);

    spy.call([]);

    Expect(fake.function).not.toHaveBeenCalled();
  }
}
