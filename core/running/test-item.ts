import { ITest, ITestCase, ITestFixture } from "../_interfaces";
import { METADATA_KEYS } from "../alsatian-core";
import { ISetupTeardownMetadata } from "../decorators/_interfaces";
import { TestTimeoutError } from "../errors";

export class TestItem {
  public get testCase() {
    return this._testCase;
  }
  public get test() {
    return this._test;
  }
  public get testFixture() {
    return this._testFixture;
  }

  public isRunning = false;

  private _testCase: ITestCase;

  private _test: ITest;

  private _testFixture: ITestFixture;

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
      } catch (error) {
        throw error;
      } finally {
        await this._teardown();
      }
    }
  }

  private async _runTest(timeout: number) {
    return new Promise<any>(async (resolve, reject) => {
      const timeoutCheck = setTimeout(() => {
        reject(new TestTimeoutError(timeout));
      }, timeout);

      try {
        await this._execute();
        resolve();
      } catch (exception) {
        reject(exception);
      } finally {
        clearTimeout(timeoutCheck);
      }
    });
  }

  private async _execute() {
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
    await this._testFixture.fixture[funcMetadata.propertyKey].call(
      this.testFixture.fixture
    );
  }
}
