import { Expect, Teardown, TeardownFixture, Test, TestFixture } from "../../../../../core/alsatian-core";

@TestFixture("teardown fixtures")
export class TeardownFixtureTests {

   @TeardownFixture
   teardownFixture() {
       TeardownFixtureTests.teardownFixtureCount++;
   }

   @Test("teardown fixture not called before first test")
   firstTestTeardownFixtureNotCalled() {
       Expect(TeardownFixtureTests.teardownFixtureCount).toBe(0);
   }

   @Test("teardown fixture has still not been called after first test or before second")
   teardownFixtureStillNotBeenCalled() {
       Expect(TeardownFixtureTests.teardownFixtureCount).toBe(0);
   }
}

TeardownFixtureTests.teardownFixtureCount = 0;
