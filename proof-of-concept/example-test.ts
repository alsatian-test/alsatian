import { TestCase } from "./test-case-decorator";
import { Test } from "./test-decorator";
import { AsyncTest } from "./async-test-decorator";
import { TestFixture } from "./test-fixture";

export class ExampleTest extends TestFixture {

  @TestCase(true)
  @TestCase(false)
  @TestCase(1)
  @TestCase("")
  public checkIsTrue(value: boolean) {
    return value === true;
  }

  private _ignoreMe() {
    console.log("you should not see me");
  }

  @Test()
  private _iShouldBeRun() {
    // console.log("you should see me");
  }

  @Test()
  public errorTest() {
    throw new Error();
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
        throw new Error();
     }, 1000);

     return promise;
  }

    @Test("Nicely described test")
    public nicelyDescribedTest() {
      // console.log("you should see me");
    }
}
