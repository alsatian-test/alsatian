import {
	AsyncTeardown,
	Expect,
	Teardown,
	TeardownFixture,
	Test,
	TestFixture
} from "alsatian";

@TestFixture("teardown fixtures")
export class TeardownFixtureTests {
	public static teardownFixtureCount: number = 0;

	@TeardownFixture
	private _teardownFixture() {
		TeardownFixtureTests.teardownFixtureCount++;
	}

	@Test("teardown fixture not called before first test")
	public async firstTestTeardownFixtureNotCalled() {
		Expect(TeardownFixtureTests.teardownFixtureCount).toBe(0);
	}

	@Test(
		"teardown fixture has still not been called after first test or before second"
	)
	public async teardownFixtureStillNotBeenCalled() {
		Expect(TeardownFixtureTests.teardownFixtureCount).toBe(0);
	}
}
