import { Any, TypeMatcher } from "../spying";

export function stringify(data: any) {
    if (data instanceof Array) {
        return stringifyArray(data);
    }

    if (data === Any) {
        return "Anything";
    }

    if (data instanceof TypeMatcher) {
        return data.stringify();
    }

    if (data instanceof Function) {
        if (data.name) {
            return data.name;
        }

        return "anonymous function";
    }

    if (data === undefined) {
        return "undefined";
    }

    return JSON.stringify(data);

}

function stringifyArray(array: Array<any>): string {
    return `[${array.map(stringify).join(", ")}]`;
}
