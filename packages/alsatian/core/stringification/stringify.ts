import { Any, TypeMatcher } from "../spying";

export function stringify(data: any): string {
	if (isItearable(data)) {
		return stringifyIterable(data);
	}

	if (data instanceof Function) {
		return stringifyFunction(data);
	}

	return stringifyObject(data);
}

function isItearable(data: any) {
	return data && typeof data[Symbol.iterator] === "function";
}

function stringifyFunction(data: (...args: Array<any>) => any) {
	if (data === Any) {
		return "Anything";
	}

	return data.name || "anonymous function";
}

function stringifyObject(data: object) {
	if (data instanceof TypeMatcher) {
		return data.stringify();
	}

	return JSON.stringify(data, createCircularReplacer(data)) || "undefined";
}

function stringifyIterable(data: Iterable<any>) {
	if (data instanceof Array) {
		return stringifyArray(data);
	}

	if (data instanceof Map) {
		return `Map<${data.size}>`;
	}

	return stringifyObject(data);
}

function createCircularReplacer(rootObject: object) {
	const cache: Array<any> = [];

	return (key: string, value: any) =>
		circularReplacer(key, value, cache, rootObject);
}

function circularReplacer(
	key: string,
	value: any,
	cache: Array<any>,
	rootObject: object
) {
	if (typeof value === "function") {
		return value.toString();
	}

	if (typeof value === "object" && value !== null) {
		if (cache.indexOf(value) !== -1) {
			// Duplicate reference found, discard key
			return;
		}
		// Store value in our collection
		cache.push(value);
	}

	return value;
}

function stringifyArray(array: Array<any>): string {
	return `[${array.map(stringify).join(", ")}]`;
}
