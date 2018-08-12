import {
  AsyncTest,
  Expect,
  TestCase,
  TestOutcome
} from "../../../../core/alsatian-core";
import { TestItem } from "../../../../core/running/test-item";
import { TestBuilder } from "../../../builders/test-builder";
import { TestFixtureBuilder } from "../../../builders/test-fixture-builder";

export class TestItemRunAsyncTests {
  @AsyncTest()
  public async successfulAsyncTest() {
    const test = new TestBuilder().withTestCaseCount(1).build();
    test.isAsync = true;

    const testFixture = new TestFixtureBuilder()
      .withFixture({
        testFunction() {
          return new Promise(resolve => {
            (this as any).testItem.registerMatcher(
              true,
              "expected something to be something.",
              "something",
              "something"
            );
            
            resolve();
          });
        }
      })
      .addTest(test)
      .build();

    const testItem = new TestItem(testFixture, test, test.testCases[0]);
    testFixture.fixture.testItem = testItem as any;

    const result = (await testItem.run(500))[0];

    Expect(result.outcome).toBe(TestOutcome.Pass);
  }

  @AsyncTest()
  public async ignoreAsyncTest() {
    const test = new TestBuilder().withTestCaseCount(1).build();
    test.ignored = true;
    test.isAsync = true;

    const testFixture = new TestFixtureBuilder().addTest(test).build();

    const testItem = new TestItem(testFixture, test, test.testCases[0]);

    const result = (await testItem.run(500))[0];

    Expect(result.outcome).toBe(TestOutcome.Skip);
  }

  @AsyncTest()
  public async failAsyncTest() {
    const test = new TestBuilder().withTestCaseCount(1).build();
    test.isAsync = true;

    const testFixture = new TestFixtureBuilder()
      .withFixture({
        testFunction() {
          return new Promise(resolve => {
            (this as any).testItem.registerMatcher(
              false,
              "expected something to be nothing.",
              "something",
              "nothing"
            );
            resolve();
          })
        }
      })
      .addTest(test)
      .build();

    const testItem = new TestItem(testFixture, test, test.testCases[0]);
    testFixture.fixture.testItem = testItem as any;

    const result = (await testItem.run(500))[0];

    Expect(result.outcome).toBe(TestOutcome.Fail);
    Expect(result.message).toBe("expected something to be nothing.");
    Expect(result.expected).toBe("expected");
    Expect(result.actual).toBe("nothing");
  }

  @AsyncTest()
  public async errorAsyncTest() {
    const test = new TestBuilder().withTestCaseCount(1).build();
    test.isAsync = true;

    const expectedError = new Error("something awful happened.");

    const testFixture = new TestFixtureBuilder()
      .withFixture({
        testFunction: () =>
          new Promise((resolve, reject) => {
            reject(expectedError);
          })
      })
      .addTest(test)
      .build();

    const testItem = new TestItem(testFixture, test, test.testCases[0]);

    const result = (await testItem.run(500))[0];

    Expect(result.outcome).toBe(TestOutcome.Error);
    Expect(result.error).toBe(expectedError);
  }

  @AsyncTest()
  public async testErrorAsyncTest() {
    const test = new TestBuilder().withTestCaseCount(1).build();
    test.isAsync = true;

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

  @TestCase(1)
  @TestCase(42)
  @TestCase(99)
  @AsyncTest()
  public async timeoutAsyncTest(timeout: number) {
    const test = new TestBuilder().withTestCaseCount(1).build();
    test.isAsync = true;

    const testFixture = new TestFixtureBuilder()
      .withFixture({
        testFunction: () =>
          new Promise(resolve => {
            setTimeout(resolve, timeout + 100);
          })
      })
      .addTest(test)
      .build();

    const testItem = new TestItem(testFixture, test, test.testCases[0]);

    const result = (await testItem.run(timeout))[0];

    Expect(result.outcome).toBe(TestOutcome.Error);
    Expect(result.error.message).toBe(
      "The test exceeded the given timeout of " + timeout + "ms."
    );
  }
}
