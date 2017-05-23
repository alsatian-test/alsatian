import { IExpect } from "../";
import { MixedMatcher } from "../matchers";
import { fail } from "./fail";

export declare type MatcherConstructor = new (actualValue: any) => MixedMatcher;
export declare type MatcherFunction = (actualValue: any) => MixedMatcher;

export function buildExpect<ExpectType extends IExpect>(matcherFunction: MatcherFunction): ExpectType;
export function buildExpect<ExpectType extends IExpect>(matcherConstructor: MatcherConstructor): ExpectType;
export function buildExpect<ExpectType extends IExpect>(expectFunction: MatcherFunction | MatcherConstructor): ExpectType {    
    const ExtendedExpect = expectFunction as ExpectType;
    ExtendedExpect.fail = fail;
    return ExtendedExpect;
}
