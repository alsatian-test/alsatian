import { TestCase } from "./test-case-decorator";
import { Test } from "./test-decorator";

export class ExampleTest {

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
    console.log("you should see me");
  }
}
