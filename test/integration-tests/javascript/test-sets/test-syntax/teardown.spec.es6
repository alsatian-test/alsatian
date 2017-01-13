import { Teardown, AsyncTeardown, TestFixture, Expect, Test } from "../../../../core/alsatian-core";

@TestFixture("teardown tests")
export class TeardownTests {

   constructor() {
       this._teardownComplete = false;
       this._asyncTeardownComplete = false;
   }

   @Teardown
   _teardown() {
       this._teardownComplete = true;
   }

   @AsyncTeardown
   async _asyncTeardown() {
       return new Promise((resolve, reject) => {
           this._asyncTeardownComplete = true;
           resolve();
       });
   }

   @Test("teardown not called before first test")
   async firstTestTeardownNotCalled() {
       Expect(this._teardownComplete).toBe(false);
       Expect(this._asyncTeardownComplete).toBe(false);
   }

   @Test("teardown has been called after first test and before second")
   async teardownNowHasBeenCalled() {
       Expect(this._teardownComplete).toBe(true);
       Expect(this._asyncTeardownComplete).toBe(true);
   }
}
   