import { Expect, TestFixture, Test } from "../../../../../core/alsatian-core";

@TestFixture("asynchronous tests")
export class AsyncTests {

   _asyncFunction() {
       return new Promise((resolve, reject) => {
           resolve(4);
       });
   }

   @Test("simple passing asynchronous test")
   passingAsyncTest() {
       return this._asyncFunction()
       .then(result => {
          Expect(result).toBe(4);
       });
   }

   @Test("simple failing asynchronous test")
   failingAsyncTest() {
       return this._asyncFunction()
       .then(result => {
          Expect(result).toBe(5);
       });
   }
}
