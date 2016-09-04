import { Promise } from "../../../promise/promise";
import { Expect, AsyncTest, TestCase, SpyOn } from "../../../core/alsatian-core";

export class PromiseTests {

   @AsyncTest()
   @TestCase("string")
   @TestCase(42)
   @TestCase(null)
   @TestCase(undefined)
   @TestCase({ "an": "object" })
   @TestCase([ "an", "array" ])
   public resolveCallsThenWithGivenError(resolvedValue: any) {
      return new Promise((resolve, reject) => {

         const handler = {
            then: () => {}
         };

         SpyOn(handler, "then");

         new Promise((subResolve, subReject) => {
            subResolve(resolvedValue);
            Expect(handler.then).toHaveBeenCalledWith(resolvedValue);
            resolve();
         })
         .then(handler.then);
      });
   }

   @AsyncTest()
   public resolvetDoesNotThrowErrorIfThenNotCalled() {
      return new Promise((resolve, reject) => {

         new Promise((subResolve, subReject) => {
            Expect(() => subResolve(null)).not.toThrow();
            resolve();
         });
      });
   }

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

   @AsyncTest()
   @TestCase(new TypeError("something wrong"))
   @TestCase(new RangeError("everything else is awful"))
   @TestCase(new Error("just bad!"))
   public resolveCallsCatchWithErrorFromConstructorCallback(error: Error) {
      return new Promise((resolve, reject) => {

         const handler = {
            catch: () => {
               Expect(handler.catch).toHaveBeenCalledWith(error);
               resolve();
            }
         };

         SpyOn(handler, "catch");

         new Promise((subResolve, subReject) => {
            throw error;
         })
         .catch(handler.catch);
      });
   }

   @AsyncTest()
   @TestCase(new TypeError("something wrong"))
   @TestCase(new RangeError("everything else is awful"))
   @TestCase(new Error("just bad!"))
   public resolveCallsCatchWithErrorFromThenCallback(error: Error) {
      return new Promise((resolve, reject) => {

         const handler = {
            then: () => { throw error; },
            catch: () => {
               Expect(handler.catch).toHaveBeenCalledWith(error);
               resolve();
            }
         };

         SpyOn(handler, "catch");

         new Promise((subResolve, subReject) => {
            subResolve(null);
         })
         .then(handler.then)
         .catch(handler.catch);
      });
   }
}
