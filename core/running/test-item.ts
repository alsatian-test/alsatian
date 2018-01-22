import { ITest, ITestCase, ITestFixture } from "../_interfaces";
import { METADATA_KEYS } from "../alsatian-core";
import { ISetupTeardownMetadata } from "../decorators/_interfaces";
import { TestTimeoutError } from "../errors";

export class TestItem {
  private _testCase: ITestCase;
  public get testCase() {
    return this._testCase;
  }

  private _test: ITest;
  public get test() {
    return this._test;
  }

  private _testFixture: ITestFixture;
  public get testFixture() {
    return this._testFixture;
  }

  public constructor(
    testFixture: ITestFixture,
    test: ITest,
    testCase: ITestCase
  ) {
    if (testFixture === null || testFixture === undefined) {
      throw new TypeError("testFixture must not be null or undefined.");
    }

    if (test === null || test === undefined) {
      throw new TypeError("test must not be null or undefined.");
    }

    if (testCase === null || testCase === undefined) {
      throw new TypeError("testCase must not be null or undefined.");
    }

    this._testFixture = testFixture;
    this._test = test;
    this._testCase = testCase;
  }

  public async run(timeout: number) {
    if (this._test.ignored) {
      return;
    } else {
      await this._setup();
      try {
        await this._runTest(this._test.timeout || timeout);
        await this._teardown();
      } catch (error) {
        await this._teardown();
        throw error;
      }
    }
  }

  private async _runTest(timeout: number) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        reject(new TestTimeoutError(timeout));
      }, timeout);

      if (this._test.isAsync) {
        this._testFixture.fixture[this._test.key]
          .apply(this._testFixture.fixture, this._testCase.caseArguments)
          .then(resolve)
          .catch(reject);
      } else {
        this._testFixture.fixture[this._test.key].apply(
          this._testFixture.fixture,
          this._testCase.caseArguments
        );
        resolve();
      }
    });
  }

  private async _setup() {
    const setupFunctions: Array<ISetupTeardownMetadata> = Reflect.getMetadata(
      METADATA_KEYS.SETUP,
      this._testFixture.fixture
    );

    if (setupFunctions) {
      for (const setupFunction of setupFunctions) {
        if (setupFunction.isAsync) {
          await this._testFixture.fixture[setupFunction.propertyKey].call(
            this._testFixture.fixture
          );
        } else {
          this._testFixture.fixture[setupFunction.propertyKey].call(
            this._testFixture.fixture
          );
        }
      }
    }
  }

  private async _teardown() {
    const teardownFunctions: Array<
      ISetupTeardownMetadata
    > = Reflect.getMetadata(METADATA_KEYS.TEARDOWN, this._testFixture.fixture);

    if (teardownFunctions) {
      for (const teardownFunction of teardownFunctions) {
        if (teardownFunction.isAsync) {
          await this._testFixture.fixture[teardownFunction.propertyKey].call(
            this._testFixture.fixture
          );
        } else {
          this._testFixture.fixture[teardownFunction.propertyKey].call(
            this._testFixture.fixture
          );
        }
      }
    }
  }
}
