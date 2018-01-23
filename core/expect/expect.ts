import { Matcher, MixedMatcher } from "../matchers";
import { buildExpect } from "./build-expect";
import { IExpect } from "./expect.i";

function ExpectFunction<ActualType>(
  actualValue: ActualType
): Matcher<ActualType> {
  return new MixedMatcher(actualValue);
}

const EXPECT = buildExpect<IExpect>(ExpectFunction);

export { EXPECT as Expect };
