import {
  FluentExpect as Expect,
  Test,
  TestCase,
  Any
} from "../../../../core/alsatian-core";

export class BeInstanceOfTests {
  @TestCase(null)
  @TestCase("asdf")
  @TestCase(123)
  @TestCase({})
  public definedPasses(instance: any) {
    const expect = Expect(instance);

    Expect(() => expect.to.beDefined()).not.to.throw();
  }

  @TestCase(null)
  @TestCase("asdf")
  @TestCase(123)
  @TestCase({})
  public notDefinedPasses(instance: any) {
    const expect = Expect(instance);

    Expect(() => expect.not.to.beDefined()).to.throw();
  }

  @TestCase(undefined)
  public definedFails(instance: any) {
    const expect = Expect(instance);

    Expect(() => expect.to.beDefined())
      .to.throw()
      .with.properties({ message: /should be defined/ });
  }
}
