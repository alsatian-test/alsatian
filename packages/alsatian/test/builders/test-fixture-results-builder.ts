import { TestFixtureResults } from "../../core/results";
import { TestFixtureBuilder } from "./test-fixture-builder";
import { ITestFixture } from "../../core/_interfaces";

export class TestFixtureResultsBuilder {
	private testFixture = new TestFixtureBuilder().build();

	public withTestFixture(testFixture: ITestFixture) {
		this.testFixture = testFixture;
		return this;
	}

	public build() {
		return new TestFixtureResults(this.testFixture);
	}
}
