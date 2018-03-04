import {
  FluentExpect as Expect,
  Test,
  TestCase,
  Any,
  FocusTests
} from "../../../../core/alsatian-core";
import { MatchError, ErrorMatchError } from "../../../../core/errors";

// See: https://github.com/Microsoft/TypeScript/issues/13965
class MyError extends Error {
  // tslint:disable-next-line
  public __proto__: Error;
  constructor(message?: string) {
    const trueProto = new.target.prototype;
    super(message);

    // Alternatively use Object.setPrototypeOf if you have an ES6 environment.
    this.__proto__ = trueProto;
  }
}

class SomeError extends MyError {}

export class ToThrowTests {
  @TestCase((t: any) => {
    throw new Error();
  }, Error)
  @TestCase((t: any) => {
    throw new SomeError();
  }, MyError)
  public shouldMatchThrowable<TError extends Error>(
    lambda: (t: any) => void,
    type: { new (...args: Array<any>): TError }
  ) {
    const expect = Expect(lambda);

    Expect(() => expect.to.throw(type)).not.to.throw();
  }

  @TestCase((t: any) => {
    throw new Error();
  }, MyError)
  @TestCase((t: any) => {
    throw new SomeError();
  }, String)
  public shouldNotMatchThrowable<TError extends Error>(
    lambda: (t: any) => void,
    type: { new (): TError }
  ) {
    const expect = Expect(123);

    Expect(() => expect.to.throw(type))
      .to.throw()
      .with.properties({
        message: /should throw type/
      });
  }

  @Test()
  public noThrowShouldFail() {
    const expect = Expect(() => {});

    Expect(() => expect.to.throw()).to.throw();
  }
}
