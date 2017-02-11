import { AsyncSetup, Expect, Setup, SetupFixture, Teardown, Test, TestFixture } from "../../../../core/alsatian-core";

@TestFixture("setup tests")
export class SetupTests {

   private _setupComplete: boolean = false;
   private _asyncSetupComplete: boolean = false;
   private _setupFixtureCount: number = 0;

   @SetupFixture
   private _setupFixture() {
       this._setupFixtureCount ++;
   }

   @Setup
   private _setup() {
       this._setupComplete = true;
   }

   @AsyncSetup
   private async _asyncSetup(): Promise<void> {
       return new Promise<void>((resolve, reject) => {
           this._asyncSetupComplete = true;
           resolve();
       });
   }

   @Teardown
   private _teardown() {
       this._setupComplete = false;
       this._asyncSetupComplete = false;
   }

   @Test("simple setup")
   public setupTest() {
       Expect(this._setupComplete).toBe(true);
   }

   @Test("simple async setup")
   public asyncSetupTest() {
       Expect(this._asyncSetupComplete).toBe(true);
   }

   @Test("setup fixture only happened once")
   public setupFixtureOnlyHappenedOnce() {
       Expect(this._setupFixtureCount).toBe(1);
   }
}
