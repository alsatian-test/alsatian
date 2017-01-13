import { Any, TypeMatcher } from "../spying";

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
        else if (argument instanceof TypeMatcher) {
            return "Any " + (argument.type as any).name;
        }
        else {
            return JSON.stringify(argument);
        }
    }
}
