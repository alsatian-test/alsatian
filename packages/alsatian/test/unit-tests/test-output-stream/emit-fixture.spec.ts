import {
	Expect,
	SpyOn,
	TestCase,
	TestOutputStream
} from "../../../core/alsatian-core";
import { TestFixtureBuilder } from "../../builders/test-fixture-builder";

export class EmitFixtureTests {
	private static _getExpectedFixtureOutput(description: string): string {
		return `# FIXTURE ${description}\n`;
	}

	@TestCase("SomeTestFixtureName")
	@TestCase("AnotherTestFixture")
	@TestCase("lastOneIPromise")
	public shouldEmitCorrectFixtureInfo(description: string) {
		const testOutput = new TestOutputStream();
		SpyOn(testOutput, "push");

		const fixture = new TestFixtureBuilder()
			.withDescription(description)
			.build();

		testOutput.emitFixture(fixture);

		Expect(testOutput.push).toHaveBeenCalledWith(
			EmitFixtureTests._getExpectedFixtureOutput(description)
		);
	}
}
