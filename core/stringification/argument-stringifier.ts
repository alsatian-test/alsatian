import { Any, ArgumentMatcher } from "../spying";

export class ArgumentStringifier {

    public stringify(argument: any) {
        if (argument instanceof Array) {
            return this._stringifyArray(argument);
        }
        else {
            return this._stringify(argument);
        }
    }

    private _stringifyArray(array: Array<any>): string {
        return `[${array.map(this._stringify).join(", ")}]`;
    }

    private _stringify(argument: any): string {
        if (argument === Any) {
            return "Anything";
        }
        else if (argument instanceof ArgumentMatcher) {
            return argument.stringify();
        }
        else {
            return JSON.stringify(argument);
        }
    }
}
