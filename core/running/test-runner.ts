import "reflect-metadata";
import {
  Expect,
  METADATA_KEYS,
  TestCaseResult,
  TestFixtureResults,
  TestOutputStream,
  TestResults,
  TestSet,
  TestSetResults,
  TestOutcome
} from "../alsatian-core";
import { ISetupTeardownMetadata } from "../decorators/_interfaces";
import { IOnTestCompleteCBFunction } from "../events";
import { TestPlan } from "./test-plan";
import { TestSetRunInfo } from "./test-set-run-info";
import { TestItem } from "./test-item";
import { MatchError } from "../errors";

export class TestRunner {
  private _onTestCompleteCBs: Array<IOnTestCompleteCBFunction> = [];
  private _outputStream: TestOutputStream;
  public get outputStream() {
    return this._outputStream;
  }

  constructor(outputStream?: TestOutputStream) {
    // If we were given a TestOutput, use it, otherwise make one
    if (outputStream !== undefined) {
      this._outputStream = outputStream;
    } else {
      this._outputStream = new TestOutputStream();
    }
  }

  public async run(testSet: TestSet, timeout?: number | null) {
    const testPlan = new TestPlan(testSet);
    if (testPlan.testItems.length === 0) {
      throw new Error("no tests to run.");
    }

    Reflect.defineMetadata("alsatian:test-plan", testPlan, Expect);

    if (!timeout) {
      timeout = 500;
    }

    const testSetResults = new TestSetResults();

    this._outputStream.emitVersion();
    this._outputStream.emitPlan(testPlan.testItems.length);

    const testSetRunInfo = new TestSetRunInfo(
      testPlan,
      testSetResults,
      timeout
    );

    await this._runTests(testSetRunInfo, testSetResults);
  }

  /**
   * Defined the call back function to be called when the test is completed
   */
  public onTestComplete(testCompleteCB: IOnTestCompleteCBFunction) {
    this._onTestCompleteCBs.push(testCompleteCB);
  }

  private async _runTests(
    testSetRunInfo: TestSetRunInfo,
    results: TestSetResults
  ) {
    const testItems = testSetRunInfo.testPlan.testItems;
    const testFixtures = this._getTestFixtures(testItems);

    for (const testFixture of testFixtures) {
      const testFixtureItems = testItems.filter(
        testItem => testItem.testFixture === testFixture
      );

      await this._setupFixture(testFixture.fixture);

      this._outputStream.emitFixture(testFixture);

      const testFixtureResults = results.addTestFixtureResult(testFixture);

      for (const testItem of testFixtureItems) {
        const result = await this._getTestItemResult(
          testItem,
          testSetRunInfo,
          testFixtureResults
        );

        this._onTestCompleteCBs.forEach(onTestCompleteCB => {
          onTestCompleteCB({
            error: result.error,
            outcome: result.outcome,
            test: testItem.test,
            testCase: testItem.testCase,
            testFixture: testItem.testFixture,
            testId: testSetRunInfo.testPlan.testItems.indexOf(testItem) + 1
          });
        });

        this._outputStream.emitResult(testItems.indexOf(testItem) + 1, result);
      }

      await this._teardownFixture(testFixture.fixture);
    }

    this._outputStream.end();
  }

  private _getTestFixtures(testItems: Array<TestItem>) {
    return testItems
      .map(testItem => testItem.testFixture)
      .filter((fixture, index, array) => array.indexOf(fixture) === index);
  }

  private async _getTestItemResult(
    testItem: TestItem,
    testSetRunInfo: TestSetRunInfo,
    testFixtureResults: TestFixtureResults
  ) {
    let testResults = testFixtureResults.testResults.find(
      result => result.test === testItem.test
    );

    if (testResults === undefined) {
      testResults = testFixtureResults.addTestResult(testItem.test);
    }

    try {
      testItem.isRunning = true;
      const results = await testItem.run(testSetRunInfo.timeout);
      // TODO: handles OLD WAY remove later
      let overallResult = testResults.addTestCaseResult(
        testItem.testCase.caseArguments
      );
      results.forEach(result => {
        // TODO: handles OLD WAY remove later
        if (result === undefined) {
          overallResult = testResults.addTestCaseResult(
            testItem.testCase.caseArguments
          );
          return;
        }

        overallResult = testResults.addTestCaseResult(
          testItem.testCase.caseArguments,
          result.outcome === TestOutcome.Fail
            ? new MatchError(result.message, result.expected, result.actual)
            : result.outcome === TestOutcome.Error
              ? result.error
              : undefined,
          result
        );
      });
      return overallResult;
    } catch (e) {
      // TODO: handles OLD WAY remove later and replace with error rather than fail
      return testResults.addTestCaseResult(testItem.testCase.caseArguments, e);
    } finally {
      testItem.isRunning = false;
    }
  }

  private async _setupFixture(fixture: { [key: string]: () => any }) {
    await this._runFixtureFunctions(fixture, METADATA_KEYS.SETUP_FIXTURE);
  }

  private async _teardownFixture(fixture: { [key: string]: () => any }) {
    await this._runFixtureFunctions(fixture, METADATA_KEYS.TEARDOWN_FIXTURE);
  }

  private async _runFixtureFunctions(
    fixture: { [key: string]: () => any },
    metadataKey: string
  ) {
    const fixtureFunctions: Array<ISetupTeardownMetadata> = Reflect.getMetadata(
      metadataKey,
      fixture
    );

    if (fixtureFunctions) {
      for (const fixtureFunction of fixtureFunctions) {
        if (fixtureFunction.isAsync) {
          await fixture[fixtureFunction.propertyKey].call(fixture);
        } else {
          fixture[fixtureFunction.propertyKey].call(fixture);
        }
      }
    }
  }
}
