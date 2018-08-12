import {
  AsyncTest,
  Expect,
  METADATA_KEYS,
  SpyOn,
  Timeout,
  TestOutcome
} from "../../../../core/alsatian-core";
import { MatchError } from "../../../../core/errors";
import { TestItem } from "../../../../core/running/test-item";
import { TestBuilder } from "../../../builders/test-builder";
import { TestFixtureBuilder } from "../../../builders/test-fixture-builder";
import { TestSetBuilder } from "../../../builders/test-set-builder";

export class TestItemRunSyncTests {
  @AsyncTest()
  public async successfulSyncTest() {
    const test = new TestBuilder().withTestCaseCount(1).build();
    const testFixture = new TestFixtureBuilder().addTest(test).build();

    const testItem = new TestItem(testFixture, test, test.testCases[0]);

    let error: Error;

    try {
      await testItem.run(500);
    } catch (e) {
      error = e;
    }

    Expect(error).toBe(undefined);
  }

  @AsyncTest()
  public async ignoreSyncTest() {
    const test = new TestBuilder().withTestCaseCount(1).build();
    test.ignored = true;
    const testFixture = new TestFixtureBuilder().addTest(test).build();

    const testItem = new TestItem(testFixture, test, test.testCases[0]);

    let error: Error;

    try {
      await testItem.run(500);
    } catch (e) {
      error = e;
    }

    Expect(error).toBe(undefined);
  }

  @AsyncTest()
  public async failSyncTest() {
    const test = new TestBuilder().withTestCaseCount(1).build();

    const expectedError = new MatchError(
      "something",
      "nothing",
      "expected something to be nothing."
    );

    const testFixture = new TestFixtureBuilder()
      .withFixture({
        testFunction: () => {
          throw expectedError;
        }
      })
      .addTest(test)
      .build();

    const testItem = new TestItem(testFixture, test, test.testCases[0]);

    const result = (await testItem.run(500))[0];

    Expect(result.outcome).toBe(TestOutcome.Error);
    Expect(result.error).toBe(expectedError);
  }

  @AsyncTest()
  public async errorSyncTest() {
    const test = new TestBuilder().withTestCaseCount(1).build();

    const expectedError = new Error("something awful happened.");

    const testFixture = new TestFixtureBuilder()
      .withFixture({
        testFunction: () => {
          throw expectedError;
        }
      })
      .addTest(test)
      .build();

    const testItem = new TestItem(testFixture, test, test.testCases[0]);

    const result = (await testItem.run(500))[0];

    Expect(result.outcome).toBe(TestOutcome.Error);
    Expect(result.error).toBe(expectedError);
  }
}
