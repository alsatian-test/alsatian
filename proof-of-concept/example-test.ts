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
import { MatchError } from "./errors/match-error";

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

  @Test()
  public equalTest() {
    Expect(1).toEqual("1");
    Expect(2).not.toEqual("1");
  }

  @Test()
  public matchTest() {
    Expect("something").toMatch(/thing/);
    Expect("something").not.toMatch(/that/);
  }

  @Test()
  public definedTest() {
    Expect(null).toBeDefined();
    Expect(undefined).not.toBeDefined();
  }

  @Test()
  public nullTest() {
    Expect(null).toBeNull();
    Expect(undefined).not.toBeNull();
  }

  @Test()
  public truthyTest() {
    Expect(1).toBeTruthy();
    Expect(0).not.toBeTruthy();
  }

  @Test()
  public containTest() {
    Expect([1, 2, 3]).toContain(1);
    Expect([1, 2, 3]).not.toContain(4);
  }

  @Test()
  public lessThanTest() {
    Expect(3).toBeLessThan(4);
    Expect(4).not.toBeLessThan(3);
  }

  @Test()
  public greaterThanTest() {
    Expect(4).toBeGreaterThan(3);
    Expect(3).not.toBeGreaterThan(4);
  }

  @Test()
  public throwTest() {
    Expect(() => { throw new Error(); }).toThrow();
    Expect(() => { }).not.toThrow();
  }

  @Test()
  @FocusTest
  public throwErrorTest() {
    Expect(() => { throw new MatchError(1, 2, true); }).toThrowError(MatchError, "Expected 1 to be 2.");
    Expect(() => { throw new MatchError(1, 2, false) }).not.toThrowError(MatchError, "Expected 1 to be 2.");
    Expect(() => { throw new Error("Expected 1 to be 2.") }).not.toThrowError(MatchError, "Expected 1 to be 2.");
    Expect(() => { throw new Error() }).not.toThrowError(MatchError, "Expected 1 to be 2.");
  }
}
