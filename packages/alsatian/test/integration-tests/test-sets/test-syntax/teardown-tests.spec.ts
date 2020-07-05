import {
	AsyncTeardown,
	Expect,
	Teardown,
	TeardownFixture,
	Test,
	TestFixture
} from "alsatian";
import { TeardownFixtureTests } from "./teardown-fixture.spec";

@TestFixture("teardown tests")
export class TeardownTests {
	private teardownComplete: boolean = false;
	private asyncTeardownComplete: boolean = false;

	@Teardown
	private teardown() {
		this.teardownComplete = true;
	}

	@AsyncTeardown
	private async asyncTeardown(): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			this.asyncTeardownComplete = true;
			resolve();
		});
	}

	@Test("teardown not called before first test")
	public async firstTestTeardownNotCalled() {
		Expect(this.teardownComplete).toBe(false);
		Expect(this.asyncTeardownComplete).toBe(false);
	}

	@Test("teardown has been called after first test and before second")
	public async teardownNowHasBeenCalled() {
		Expect(this.teardownComplete).toBe(true);
		Expect(this.asyncTeardownComplete).toBe(true);
	}

	@Test("teardown fixture has been called when previous fixture completes")
	public teardownFixtureCalledOnPreviousFixture() {
		Expect(TeardownFixtureTests.teardownFixtureCount).toBe(1);
	}
}
