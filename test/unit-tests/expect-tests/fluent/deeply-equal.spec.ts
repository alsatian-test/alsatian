import {
  FluentExpect as Expect,
  Test,
  TestCase,
  Any,
  SpyOn
} from "../../../../core/alsatian-core";

export class DeeplyEqualTests {
  // This helper (and the others) are mostly covered under the equals() tests.
  @TestCase(0, 0)
  public DefaultsToStrictlyEqual_True(a: any, b: any) {
    Expect(a).to.deeplyEqual(b);
  }

  @TestCase(false, 0)
  public DefaultsToStrictlyEqual_False(a: any, b: any) {
    Expect(a).not.to.deeplyEqual(b);
  }
}
