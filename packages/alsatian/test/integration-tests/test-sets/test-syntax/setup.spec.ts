import {
	AsyncSetup,
	Expect,
	Setup,
	SetupFixture,
	Teardown,
	Test,
	TestFixture
} from "alsatian";

@TestFixture("setup tests")
export class SetupTests {
	private setupComplete: boolean = false;
	private asyncSetupComplete: boolean = false;
	private setupFixtureCount: number = 0;

	@SetupFixture
	private setupFixture() {
		this.setupFixtureCount++;
	}

	@Setup
	private setup() {
		this.setupComplete = true;
	}

	@AsyncSetup
	private async asyncSetup(): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			this.asyncSetupComplete = true;
			resolve();
		});
	}

	@Teardown
	private teardown() {
		this.setupComplete = false;
		this.asyncSetupComplete = false;
	}

	@Test("simple setup")
	public setupTest() {
		Expect(this.setupComplete).toBe(true);
	}

	@Test("simple async setup")
	public asyncSetupTest() {
		Expect(this.asyncSetupComplete).toBe(true);
	}

	@Test("setup fixture only happened once")
	public setupFixtureOnlyHappenedOnce() {
		Expect(this.setupFixtureCount).toBe(1);
	}
}
