import { Teardown, AsyncTeardown, TestFixture, Expect, Test } from "../../../../../core/alsatian-core";
import { TeardownFixtureTests } from "./teardown-fixture.spec";

@TestFixture("teardown tests")
export class TeardownTests {

   constructor() {
       this._teardownComplete = false;
       this._asyncTeardownComplete = false;
   }

   @Teardown
   teardown() {
       this._teardownComplete = true;
   }

   @AsyncTeardown
   asyncTeardown() {
       return new Promise((resolve, reject) => {
           this._asyncTeardownComplete = true;
           resolve();
       });
   }

   @Test("teardown not called before first test")
   firstTestTeardownNotCalled() {
       Expect(this._teardownComplete).toBe(false);
       Expect(this._asyncTeardownComplete).toBe(false);
   }

   @Test("teardown has been called after first test and before second")
   teardownNowHasBeenCalled() {
       Expect(this._teardownComplete).toBe(true);
       Expect(this._asyncTeardownComplete).toBe(true);
   }

   @Test("teardown fixture has been called when previous fixture completes")
   teardownFixtureCalledOnPreviousFixture() {
       Expect(TeardownFixtureTests.teardownFixtureCount).toBe(1);
   }
}
   