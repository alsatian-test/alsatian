import { Matcher, MixedMatcher } from "../matchers";
import { buildExpect } from "./build-expect";
import { IExpect } from "./expect.i";
import { TestPlan } from "../running";

function ExpectFunction<ActualType>(
  actualValue: ActualType
): Matcher<ActualType> {
  const testPlan = Reflect.getMetadata("alsatian:test-plan", EXPECT) as TestPlan;
  const stack = new Error().stack.split("\n");
  const callerStackLine = stack[stack.findIndex(x => /Object.EXPECT/.test(x)) + 1];
  const path = callerStackLine.replace(/^\s*at (.+) \((.+):\d+:\d+\)$/, "$2");
  const functionName = callerStackLine.replace(/^\s*at .+\.(.+) \((.+):\d+:\d+\)$/, "$1");
  const testItem = testPlan.testItems.find(x => x.testFixture.filePath.replace(/\//g, "\\") === path && x.test.key === functionName);
  return new MixedMatcher(actualValue, testItem);
}

const EXPECT = buildExpect<IExpect>(ExpectFunction);

export { EXPECT as Expect };
