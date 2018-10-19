import "reflect-metadata";
import {
  Expect,
  METADATA_KEYS,
  SpyOn,
  Test,
  TestCase,
  TestFixture,
  Timeout
} from "../../../../core/alsatian-core";
import { FileRequirer } from "../../../../core/file-requirer";
import { TestLoader } from "../../../../core/test-loader";

export class TestTimeoutTests {
  @Test()
  public noTimeoutSetToNullTest() {
    const fileRequirer = new FileRequirer();

    @TestFixture()
    class Fixture {
      @Test()
      public noTimeoutTest() {}
    }

    const spy = SpyOn(fileRequirer, "require");
    spy.andStub();
    spy.andReturn(Fixture);

    const testLoader = new TestLoader(fileRequirer);

    Expect(testLoader.loadTestFixture("test")[0].tests[0].timeout).toBe(null);
  }

  @TestCase(1)
  @TestCase(2)
  @TestCase(42)
  public timeoutSetTest(timeoutPeriod: number) {
    const fileRequirer = new FileRequirer();

    @TestFixture()
    class Fixture {
      @Test()
      @Timeout(timeoutPeriod)
      public timeoutTest() {}
    }

    const spy = SpyOn(fileRequirer, "require");
    spy.andStub();
    spy.andReturn(Fixture);

    const testLoader = new TestLoader(fileRequirer);

    Expect(testLoader.loadTestFixture("test")[0].tests[0].timeout).toBe(
      timeoutPeriod
    );
  }
}
