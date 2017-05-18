import { ContainerMatcher } from "./container-matcher";
import { EmptyMatcher } from "./empty-matcher";
import { FunctionMatcher } from "./function-matcher";
import { FunctionSpyMatcher } from "./function-spy-matcher";
import { Matcher } from "./matcher";
import { NumberMatcher } from "./number-matcher";
import { PropertyMatcher } from "./property-matcher";
import { StringMatcher } from "./string-matcher";

export class MixedMatcher extends Matcher<any> {

}

applyMixins(
    MixedMatcher,
    ContainerMatcher,
    EmptyMatcher,
    FunctionMatcher,
    FunctionSpyMatcher,
    NumberMatcher,
    PropertyMatcher,
    StringMatcher
);

function applyMixins(derivedCtor: any, ...baseCtors: Array<any>) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
}
