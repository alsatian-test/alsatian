import { ITestFixture, ITest, ITestCase } from "./_interfaces";
import { METADATA_KEYS } from "./alsatian-core";
import { createPromise } from "../promise/create-promise";
import { TestTimeoutError } from "./_errors";

export class TestItem {

  public constructor(private _testFixture: ITestFixture, private _test: ITest, private _testCase: ITestCase) {}

  public run(): any {

    const promise = createPromise();

    setTimeout(() => {

      if (this._test.ignored) {
        createResultAndRunNextTest(test);
      }
      else {

        this._setup();

        if (!this._test.isAsync) {
          try {
            this._testFixture.fixture[this._test.key].apply(this._testFixture.fixture, this._testCase.arguments);
            createResultAndRunNextTest(test);

          }
          catch (error) {
            createResultAndRunNextTest(test, error);
          }
        }
        else {
          let timeout = false;

          let promise: any = this._testFixture.fixture[this._test.key].apply(this._testFixture.fixture, this._testCase.arguments);
          let timeoutCheck: number = null;

         promise.then(() => {
            if (!timeout) {
              clearTimeout(timeoutCheck);
              createResultAndRunNextTest(test);
            }
          })
          .catch((error: Error) => {
            createResultAndRunNextTest(test, error);
          });

          timeoutCheck = setTimeout(() => {
            timeout = true;
            let error = new TestTimeoutError(this._test.timeout || timeout);
            createResultAndRunNextTest(test, error);
         }, this._test.timeout || timeout);
        }
      }
    });

    return promise;
  }

  private _runTestItem() {

  }

  private _setup() {
    let setupFunctions: Array<string> = Reflect.getMetadata(METADATA_KEYS.SETUP, this._testFixture.fixture);

    if (setupFunctions) {
      setupFunctions.forEach(setupFunction => {
          this._testFixture.fixture[setupFunction].call(this._testFixture.fixture);
      });
    }
  }

  private _tearDown() {
    let teardownFunctions: Array<string> = Reflect.getMetadata(METADATA_KEYS.TEARDOWN, this._testFixture.fixture);

    if (teardownFunctions) {
      teardownFunctions.forEach(teardownFunction => {
          this._testFixture.fixture[teardownFunction].call(this._testFixture.fixture);
      });
    }
  }
}
