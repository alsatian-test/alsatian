import { AsyncSetup, Expect, Setup, SetupFixture, Teardown, Test, TestFixture } from "../../../../../core/alsatian-core";

@TestFixture("setup tests")
export class SetupTests {

   constructor() {
       this._setupComplete = false;
       this._asyncSetupComplete = false;
       this._setupFixtureCount = 0;
   }

   @SetupFixture
   setupFixture() {
       this._setupFixtureCount++;
   }

   @Setup
   setup() {
       this._setupComplete = true;
   }

   @AsyncSetup
   asyncSetup() {
       return new Promise((resolve, reject) => {
           this._asyncSetupComplete = true;
           resolve();
       });
   }

   @Teardown
   teardown() {
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

   @Test("setup fixture only happened once")
   setupFixtureOnlyHappenedOnce() {
       Expect(this._setupFixtureCount).toBe(1);
   }
}
   