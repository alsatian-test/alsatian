import { MatchError } from "../errors";
import { IExpect } from "./expect.i";
import { Matcher, MixedMatcher } from "../matchers";
import { buildExpect } from "./build-expect";

function ExpectFunction<ActualType>(actualValue: ActualType): Matcher<ActualType> {
   return new MixedMatcher(actualValue);
}

const Expect = buildExpect<IExpect>(ExpectFunction);

export {
    Expect
};
