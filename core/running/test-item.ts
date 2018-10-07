import { ITest, ITestCase, ITestFixture } from "../_interfaces";
import { METADATA_KEYS } from "../alsatian-core";
import { ISetupTeardownMetadata } from "../decorators/_interfaces";
import { TestTimeoutError } from "../errors";
import { TestOutcome } from "../results";
import { TestOutputStream } from "../test-output-stream";
import { SpyOn } from "../spying";

export interface IMatcher {
  isValid: boolean | (() => Promise<boolean>);
  message: string;
  expected: any;
  actual: any;
  extras?: { [prop: string]: any };
}

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

  public readonly matchers: Array<IMatcher> = [];

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

  public registerMatcher(
    isValid: boolean | (() => Promise<boolean>),
    message: string,
    expected: any,
    actual: any,
    extras?: { [prop: string]: any }
  ): any {
    this.matchers.push({
      isValid,
      message,
      expected,
      actual,
      extras
    });
  }

  public async run(timeout: number/*, outputStream: TestOutputStream */) {
    if (this._test.ignored) {
      return;
    } else {
      await this._setup();

      try {
        // this may be a bit dumb as variable name can be changed
        /*
        if (/(\(|\s)Expect\(/.test(this._testFixture.fixture.toString())) {
          outputStream.emitWarning(`No calls to Expect in ${this.test.description}`);
        }
        */

        await this._runTest(this._test.timeout || timeout);
      } catch (error) {
        throw error;
      } finally {
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
