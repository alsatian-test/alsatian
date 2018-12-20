import { TestFixtureResults } from "../../core/results";
import { TestFixtureBuilder } from "./test-fixture-builder";
import { ITestFixture } from "../../core/_interfaces";

export class TestFixtureResultsBuilder {
	private _testFixture = new TestFixtureBuilder().build();

	public withTestFixture(testFixture: ITestFixture) {
		this._testFixture = testFixture;
		return this;
	}

	public build() {
		return new TestFixtureResults(this._testFixture);
	}
}
