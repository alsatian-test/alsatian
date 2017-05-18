import { MatchError } from "./errors";
import { IExpect } from "./expect.i";
import { Matcher, MixedMatcher } from "./matchers";

function ExpectFunction<ActualType>(actualValue: ActualType): Matcher<ActualType> {
   return new MixedMatcher(actualValue);
}

function fail(message: string) {
    throw new MatchError(message);
}

const EXPECT = ExpectFunction as IExpect;
EXPECT.fail = fail;

export {
    EXPECT as Expect
};
