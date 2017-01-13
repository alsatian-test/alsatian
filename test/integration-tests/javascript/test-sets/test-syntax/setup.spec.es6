import { Setup, AsyncSetup, Teardown, TestFixture, Expect, Test } from "../../../../../core/alsatian-core";

@TestFixture("setup tests")
export class SetupTests {

   constructor() {
       this._setupComplete = false;
       this._asyncSetupComplete = false;
   }

   @Setup
   _setup() {
       this._setupComplete = true;
   }

   @AsyncSetup
   async _asyncSetup() {
       return new Promise((resolve, reject) => {
           this._asyncSetupComplete = true;
           resolve();
       });
   }

   @Teardown
   _teardown() {
       this._setupComplete = false;
       this._asyncSetupComplete = false;
   }

   @Test("simple setup")
   setupTest() {
       Expect(this._setupComplete).toBe(true);
   }

   @Test("simple async setup")
   asyncSetupTest() {
       Expect(this._asyncSetupComplete).toBe(true);
   }
}
   