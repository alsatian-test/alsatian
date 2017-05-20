import { IExpect } from "../";
import { MixedMatcher } from "../matchers";
import { fail } from "./fail";

export function buildExpect<S extends IExpect>(expectFunction: (actualValue: any) => MixedMatcher): S {    
    const ExtendedExpect = expectFunction as S;
    ExtendedExpect.fail = fail;
    return ExtendedExpect;
}
