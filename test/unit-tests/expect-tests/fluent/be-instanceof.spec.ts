import {
  FluentExpect as Expect,
  Test,
  TestCase,
  Any
} from "../../../../core/alsatian-core";

class MyError extends Error {}

export class BeInstanceOfTests {
  @TestCase(new Date(), Date)
  @TestCase(new BeInstanceOfTests(), BeInstanceOfTests)
  @TestCase(new Error(), Error)
  @TestCase(new MyError(), Error)
  public instancesOfPasses(instance: any, type: { new (): any }) {
    const expect = Expect(instance);

    Expect(() => expect.to.beInstanceOf(type)).not.to.throw();
  }

  @TestCase(3, Number)
  @TestCase("asdf", String)
  @TestCase(new Error(), String)
  public instancesOfFails(instance: any, type: { new (): any }) {
    const expect = Expect(instance);

    Expect(() => expect.to.beInstanceOf(type)).to.throw();
  }
}
