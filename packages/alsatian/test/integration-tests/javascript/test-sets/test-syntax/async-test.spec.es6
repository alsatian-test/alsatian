import { Expect, TestFixture, Test } from "../../../../../core/alsatian-core";

@TestFixture("asynchronous tests")
export class AsyncTests {

   asyncFunction() {
       return new Promise((resolve, reject) => {
           resolve(4);
       });
   }

   @Test("simple passing asynchronous test")
   passingAsyncTest() {
       return this.asyncFunction()
       .then(result => {
          Expect(result).toBe(4);
       });
   }

   @Test("simple failing asynchronous test")
   failingAsyncTest() {
       return this.asyncFunction()
       .then(result => {
          Expect(result).toBe(5);
       });
   }
}
