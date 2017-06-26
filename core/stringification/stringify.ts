import { Any, TypeMatcher } from "../spying";

export function stringify(data: any) {
    if (data instanceof Array) {
        return stringifyArray(data);
    }

    if (data === Any) {
        return "Anything";
    }
    else if (data instanceof TypeMatcher) {
        return data.stringify();
    }
    else {
        return JSON.stringify(data);
    }
}

function stringifyArray(array: Array<any>): string {
    return `[${array.map(stringify).join(", ")}]`;
}
