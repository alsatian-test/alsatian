import { ITestFixture } from "../../core/_interfaces/test-fixture.i";
import { ITest } from "../../core/_interfaces/test.i";
import { TestFixture } from "../../core/test-fixture";
import { TestBuilder } from "./test-builder";

export class TestFixtureBuilder {
	private testFixture: ITestFixture;

	public constructor() {
		this.testFixture = new TestFixture("Unnamed Test Fixture");
		this.testFixture.filePath = new Error().stack
			?.split("\n")[3]
			.replace(/^\s*at (.+) \((.+):\d+:\d+\)$/, "$2");
	}

	public withFilePath(filePath: string) {
		this.testFixture.filePath = filePath;
		return this;
	}

	public withFixture(fixture: {
		[id: string]: (...args: Array<any>) => any;
	}): TestFixtureBuilder {
		this.testFixture.fixture = fixture;
		return this;
	}

	public addTest(test: ITest): TestFixtureBuilder {
		this.testFixture.tests.push(test);
		if (this.testFixture.fixture[test.key] === undefined) {
			this.testFixture.fixture[test.key] = () => {};
		}
		return this;
	}

	public withTests(tests: Array<ITest>): TestFixtureBuilder {
		tests.forEach(test => {
			this.testFixture.addTest(test);
			this.testFixture.fixture[test.key] = () => {};
		});

		return this;
	}

	public withTestCount(testCount: number): TestFixtureBuilder {
		const testBuilder = new TestBuilder();

		for (let i = 0; i < testCount; i++) {
			this.testFixture.tests.push(testBuilder.build());
		}

		return this;
	}

	public withDescription(description: string): TestFixtureBuilder {
		this.testFixture.description = description;
		return this;
	}

	public build(): ITestFixture {
		return this.testFixture;
	}
}
