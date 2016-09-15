import { PropertySpy } from "../../../../core/_spying";
import { Test, Expect, FunctionSpy } from "../../../../core/alsatian-core";

export class AndCallGetterTests {

   @Test()
   public originalGetterCalled() {

      const testObject: any = { };

      const originalGetter = new FunctionSpy();

      Object.defineProperty(testObject, "property", { get: originalGetter, configurable: true });

      new PropertySpy(testObject, "property");

      testObject.property;

      Expect(originalGetter).toHaveBeenCalled();
   }
}
