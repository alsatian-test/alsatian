import { ITestFixture } from "../../core/_interfaces/test-fixture.i";
import { SpyOnProperty } from "../../core/alsatian-core";
import { TestSet } from "../../core/test-set";

export class TestSetBuilder {
	private testSet: TestSet = {} as TestSet;

	private testFixtures: Array<ITestFixture> = [];

	public constructor() {
		Object.defineProperty(this.testSet, "testFixtures", {
			get: () => null,
			configurable: true
		});
		SpyOnProperty(this.testSet, "testFixtures").andReturnValue(
			this.testFixtures
		);
	}

	public withTestFixtures(testFixtures: Array<ITestFixture>): TestSetBuilder {
		this.testFixtures = testFixtures;
		SpyOnProperty(this.testSet, "testFixtures").andReturnValue(
			this.testFixtures
		);
		return this;
	}

	public addTestFixture(testFixture: ITestFixture): TestSetBuilder {
		this.testFixtures.push(testFixture);
		return this;
	}

	public build(): TestSet {
		return this.testSet;
	}
}
