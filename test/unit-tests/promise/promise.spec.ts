import { Promise } from "../../../promise/promise";
import { Expect, AsyncTest, TestCase, SpyOn, FocusTests } from "../../../core/alsatian-core";

@FocusTests
export class PromiseTests {

   @AsyncTest()
   @TestCase(new TypeError("something wrong"))
   @TestCase(new RangeError("everything else is awful"))
   @TestCase(new Error("just bad!"))
   public rejectCallsCatchWithGivenError(error: Error) {
      return new Promise((resolve, reject) => {

         const handler = {
            catch: () => {}
         };

         SpyOn(handler, "catch");

         new Promise((subResolve, subReject) => {
            subReject(error);
            Expect(handler.catch).toHaveBeenCalledWith(error);
            resolve();
         })
         .catch(handler.catch);
      });
   }

   @AsyncTest()
   public rejectDoesNotThrowErrorIfCatchNotCalled() {
      return new Promise((resolve, reject) => {

         new Promise((subResolve, subReject) => {
            Expect(() => subReject(new Error())).not.toThrow();
            resolve();
         });
      });
   }
}
