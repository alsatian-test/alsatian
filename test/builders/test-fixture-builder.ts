import { ITest } from "../../core/_interfaces/test.i";
import { ITestFixture } from "../../core/_interfaces/test-fixture.i";
import { TestBuilder } from "./test-builder";
import { TestFixture } from "../../core/test-fixture";

export class TestFixtureBuilder {

  private _testFixture: ITestFixture;

  public constructor() {
    this._testFixture = new TestFixture("Unnamed Test Fixture");
  }

  public withFixture(fixture: { [id: string]: (...args: Array<any>) => any }): TestFixtureBuilder {
    this._testFixture.fixture = fixture;
    return this;
  }

  public addTest(test: ITest): TestFixtureBuilder {
    this._testFixture.tests.push(test);
    if (this._testFixture.fixture[test.key] === undefined) {
        this._testFixture.fixture[test.key] = () => {};
    }
    return this;
  }

  public withTests(tests: Array<ITest>): TestFixtureBuilder {
    this._testFixture.tests = tests;

    tests.forEach(test => {
      this._testFixture.fixture[test.key] = () => {};
    });

    return this;
  }

  public withTestCount(testCount: number): TestFixtureBuilder {
    let testBuilder = new TestBuilder();

    for (let i = 0; i < testCount; i++) {
      this._testFixture.tests.push(testBuilder.build());
    }

    return this;
  }

  public withDescription(description: string): TestFixtureBuilder {
      this._testFixture.description = description;
      return this;
  }

  public build (): ITestFixture {
    return this._testFixture;
  }
}
