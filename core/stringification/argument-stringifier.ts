import { Any, TypeMatcher } from "../spying";
import { stringify } from "./stringify";

export class ArgumentStringifier {

    public stringify(argument: any) {
        return stringify(argument);
    }
}
