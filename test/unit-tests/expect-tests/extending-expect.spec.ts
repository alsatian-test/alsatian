import {
  Expect,
  Matcher,
  Test,
  TestCase,
  TestFixture,
  MatchError
} from "../../../core/alsatian-core";

class ExampleExtension {
  public theAnswer() {
    return 42;
  }
}

class ExampleExtensionMatcher extends Matcher<ExampleExtension> {
  public checkTheAnswer() {
    if (this.actualValue.theAnswer() !== 42) {
      throw new MatchError("the answer is wrong");
    }
  }
}

const EXTENDED_EXPECT = Expect.extend(ExampleExtension, ExampleExtensionMatcher);

@TestFixture("extending expect")
export class ExtendingExpectTests {
  @TestCase(undefined)
  @TestCase(null)
  @TestCase(0)
  @TestCase(42)
  @TestCase(4.2)
  @TestCase(-4.2)
  @TestCase("")
  @TestCase("something")
  @Test("actual value can be accessed")
  public canReferenceActualValue(expectedActualValue: any) {
    EXTENDED_EXPECT(new ExampleExtension()).checkTheAnswer();
  }
}
