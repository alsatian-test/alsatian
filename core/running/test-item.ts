import { ITest, ITestCase, ITestFixture } from "../_interfaces";
import { METADATA_KEYS } from "../alsatian-core";
import { ISetupTeardownMetadata } from "../decorators/_interfaces";
import { TestTimeoutError } from "../errors";

export interface Matcher {
  isValid: boolean | (() => Promise<boolean>);
  message: string;
  expected: any;
  actual: any;
}

export class TestItem {

  public registerMatcher(isValid: boolean | (() => Promise<boolean>), message: string, expected: any, actual: any): any {
    this.matchers.push({
      isValid,
      message,
      expected,
      actual
    });
  }

  public isRunning = false;

  public readonly matchers: Array<Matcher> = [];

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

        if (this.matchers.length === 0) {
          console.warn("Yikes no checks have been made");
        }

        const results: Array<any> = [];

        enum Result {
          Pass,
          Fail,
          Error
        }

        for (const matcher of this.matchers) {
          const matcherValid = typeof matcher.isValid === "boolean" ? matcher.isValid : await matcher.isValid();

          if (matcherValid) {
            results.push({
              result: Result.Pass
            });
          }
          else {
            results.push({
              result: Result.Fail,
              ... matcher
            });
          }
        }
      }
      catch (error) {
        throw error;
      }
      finally {
        await this._teardown();
      }
    }
  }

  private async _runTest(timeout: number) {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        reject(new TestTimeoutError(timeout));
      }, timeout);

      if (this._test.isAsync) {
        this._execute()
          .then(resolve)
          .catch(reject);
      } else {
        this._execute();
        resolve();
      }
    });
  }

  private _execute() {
    return this._testFixture.fixture[this._test.key].apply(
      this._testFixture.fixture,
      this._testCase.caseArguments
    );
  }

  private async _setup() {
    await this._runFunctionsByMetaDataKey(METADATA_KEYS.SETUP);
  }

  private async _teardown() {
    await this._runFunctionsByMetaDataKey(METADATA_KEYS.TEARDOWN);
  }

  private async _runFunctionsByMetaDataKey(metadataKey: string) {
    const functions: Array<ISetupTeardownMetadata> = Reflect.getMetadata(
      metadataKey,
      this._testFixture.fixture
    );

    if (functions) {
      for (const func of functions) {
        await this._runFunctionFromMetadata(func);
      }
    }
  }

  private async _runFunctionFromMetadata(funcMetadata: ISetupTeardownMetadata) {
    if (funcMetadata.isAsync) {
      await this._testFixture.fixture[funcMetadata.propertyKey].call(
        this.testFixture.fixture
      );
    } else {
      this._testFixture.fixture[funcMetadata.propertyKey].call(
        this.testFixture.fixture
      );
    }
  }
}
