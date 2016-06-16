import { Expect, Test, TestCase, SpyOn } from "../../../core/alsatian-core";

export class SpyOnTests {

  @Test()
  public functionIsReplacedWithSpy() {
    let object = {
      function: () => {}
    };

    let originalFunction = object.function;

    SpyOn(object, "function");

    Expect(object.function).not.toBe(originalFunction);
  }

  @Test()
  public functionStillWorks() {
    let object = {
      functionCalled: false,
      function: () => {
        object.functionCalled = true;
      }
    };

    let originalFunction = object.function;

    SpyOn(object, "function");
    object.function();

    Expect(object.functionCalled).toBe(true);
  }

   @Test()
   public callsPropertyIsSetOnFunction() {
      let object = {
        function: () => {}
      };

      let originalFunction = object.function;

      SpyOn(object, "function");

      Expect((<any>object.function).calls).toBeDefined();
      Expect((<any>object.function).calls).not.toBeNull();
   }

    @Test()
    public spyShouldBeReturned() {
       let object = {
         function: () => {}
       };

       let originalFunction = object.function;

       let spy = SpyOn(object, "function");

       Expect(spy).toBeDefined();
       Expect(spy).not.toBeNull();
    }
}
