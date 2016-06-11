import { TestCase } from "./test-case-decorator";
import { Test } from "./test-decorator";
import { AsyncTest } from "./async-test-decorator";
import { TestFixture } from "./test-fixture";
import { Expect } from "./expect";
import { IgnoreTest } from "./ignore-test-decorator";
import { IgnoreTests } from "./ignore-tests-decorator";
import { FocusTest } from "./focus-test-decorator";
import { FocusTests } from "./focus-tests-decorator";
import { Setup } from "./setup-decorator";
import { Teardown } from "./teardown-decorator";

@FocusTests
export class ExampleTest extends TestFixture {

  @TestCase(true)
  @TestCase(false)
  @TestCase(1)
  @TestCase("")
  @TestCase(undefined)
  @TestCase(null)
  public checkIsTrue(value: boolean) {
    Expect(value).toBe(true);
  }

  @TestCase(true)
  @TestCase(false)
  @TestCase(1)
  @TestCase("")
  public checkIsNotTrue(value: boolean) {
    Expect(value).not.toBe(true);
  }

  private _ignoreMe() {
    console.log("you should not see me");
  }

  @Test()
  @FocusTest
  private _iShouldBeRun() {
    // console.log("you should see me");
  }

  @Test()
  public errorTest() {
  }

  @AsyncTest()
  public asyncTest(): any {
     let promise: any = { };

     promise.then = (callback: () => any) => {
        promise.thenCallback = callback;
        return promise;
     };

     promise.catch = (callback: () => any) => {
        promise.catchCallback = callback;
        return promise;
     };

     setTimeout(() => {
        try {
           //throw new Error();
           promise.thenCallback();
        }
        catch (error) {
           promise.catchCallback(error);
        }
     }, 1000);

     return promise;
  }

  @Test("Nicely described test")
  public nicelyDescribedTest() {
    // console.log("you should see me");
  }

  @Setup
  private _doMeBefore() {
    console.log("before");
  }

  @Setup
  private _doMeBeforeAswell() {
    console.log("before 2");
  }

  @Teardown
  private _doMeAfter() {
    console.log("after");
  }

  @Teardown
  private _doMeAfterAswell() {
    console.log("after 2");
  }
}
