import { Any, TypeMatcher } from "../spying";

export function stringify(data: any): string {
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

    return JSON.stringify(data, createCircularReplacer(data));

}

function createCircularReplacer(rootObject: object) {
    const cache: Array<any> = [];

    return (key: string, value: any) => circularReplacer(key, value, cache, rootObject);
}

function circularReplacer(key: string, value: any, cache: Array<any>, rootObject: object) {
    // Unused(key);
    if (typeof value === "function") {
        return value.toString();
    }

    return value;
}

function stringifyArray(array: Array<any>): string {
    return `[${array.map(stringify).join(", ")}]`;
}
