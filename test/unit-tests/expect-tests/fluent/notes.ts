import {
  FluentExpect as Expect,
  Test,
  TestCase,
  Any
} from "../../../../core/alsatian-core";
import { EqualMatchError } from "../../../../core/errors/equal-match-error";

/** TO DO:
 * 1. Dictionary matchers should reflect level of nesting in error message.
 * 2. Make sure negations work - e.g., .not.to.throw().with.properties();
 * 3. Add fluent integration tests ^^^
 * 4. Use Mix-ins/multiple inheritance strategy
 *    1. Remove with.and and with.not
 *    2.
 * 5. In order for fluency to reach its full potential, we need to track state throughout a "sentence"
 *    and lazily evaluate the result. E.g., Expect(val).to.equal(52).or.to.equal(51);
 * 6. Documentation.
 */

/* class Rectangle {
  public width: number = 0;
  public height: number = 0;
  public rect: Rectangle;
  get area(): number {
    return this.width * this.height;
  }
}

class Picture {
  public title: string;
  public rect: Rectangle;
}

class MyError extends Error {}

var returnVal = new Rectangle();
Expect(returnVal).toBeDefined();
Expect(returnVal).toBeTruthy(returnVal instanceof Rectangle);
Expect(returnVal.message).toBe("asdf");
Expect(returnVal.stack).toMatch(/asdfasdf/);

Expect(new Rectangle())
  .to.throw(MyError)
  .with.not.properties({
    message: "asdf",
    stack: /asdfasdf/
  });

Expect(new Picture())
  .with.properties({
    title: "My Pic",
    rect: {
      width: w => w > 3,
      height: h => h > 3,
      rect: r => Expect(r).to.beDefined(),
      area: 123
    }
  })
  .and.keys([]);

// more mundane:
Expect([1, 2, 3])
  .with.elements([2, 3])
  .and.not.elements([5, 6]);
Expect("something").to.beDefined();*/
// Expect(weirdThing).to.satisfy(c => myPredicate(c));
// Expect(stringy).to.match(/stuff/);

// Expect({}).where.subset(x => x).with.all()
