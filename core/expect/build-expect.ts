import { MixedMatcher } from "../matchers";
import { IExpect } from "./expect.i";
import { fail } from "./fail";

export declare type MatcherConstructor = new (actualValue: any) => MixedMatcher;
export declare type MatcherFunction = (actualValue: any) => MixedMatcher;

export function buildExpect<ExpectType extends IExpect>(
  expectFunction: MatcherFunction | MatcherConstructor
): ExpectType {
  const EXPECT = ((actualValue: any) =>
    new (expectFunction as MatcherConstructor)(actualValue)) as ExpectType;
  EXPECT.fail = fail;
  return EXPECT;
}
