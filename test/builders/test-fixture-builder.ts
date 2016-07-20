import { ITest } from "../../core/_interfaces/test.i";
import { ITestFixture } from "../../core/_interfaces/test-fixture.i";
import { TestBuilder } from "./test-builder";

export class TestFixtureBuilder {

  private _testFixture: ITestFixture;

  public constructor() {
    this._testFixture = {
      focussed: false,
      ignored: false,
      fixture: {},
      tests: []
    };
  }

  public withFixture(fixture: { [id: string]: (...args: Array<any>) => any }): TestFixtureBuilder {
    this._testFixture.fixture = fixture;
    return this;
  }

  public addTest(test: ITest): TestFixtureBuilder {
    this._testFixture.tests.push(test);
    return this;
  }

  public withTests(tests: Array<ITest>): TestFixtureBuilder {
    this._testFixture.tests = tests;
    return this;
  }

  public withTestCount(testCount: number): TestFixtureBuilder {
    let testBuilder = new TestBuilder();

    for (let i = 0; i < testCount; i++) {
      this._testFixture.tests.push(testBuilder.build());
    }

    return this;
  }

  public build (): ITestFixture {
    return this._testFixture;
  }
}
