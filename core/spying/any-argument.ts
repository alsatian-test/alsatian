import { TypeMatcher } from "../_spying";

export function Any(type: new (...args: Array<any>) => any): TypeMatcher {
   return new TypeMatcher(type);
}
