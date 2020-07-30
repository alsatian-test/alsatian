import { Expect, TestFixture, AsyncTest } from "../../../../../core/alsatian-core";

@TestFixture("asynchronous tests")
export class AsyncTests {

   asyncFunction() {
       return new Promise((resolve, reject) => {
           resolve(4);
       });
   }

   @AsyncTest("simple passing asynchronous test")
   passingAsyncTest() {
       return this.asyncFunction()
       .then(result => {
          Expect(result).toBe(4);
       });
   }

   @AsyncTest("simple failing asynchronous test")
   failingAsyncTest() {
       return this.asyncFunction()
       .then(result => {
          Expect(result).toBe(5);
       });
   }
}
