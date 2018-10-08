import { Any, TypeMatcher } from "../spying";

const undefinedPlaceholder = "__UNDEFINED__";

export function stringify(data: any): string {
  if (data instanceof Array) {
    return stringifyArray(data);
  }

  if (data instanceof Map) {
    return `Map<${data.size}>`;
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

  const json = JSON.stringify(data, createCircularReplacer(data));
  return json.replace(`"${undefinedPlaceholder}"`, "undefined");
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
  // Unused(key);
  if (typeof value === "function") {
    return value.toString();
  }

  if (value === undefined) {
    return undefinedPlaceholder;
  }

  return value;
}

function stringifyArray(array: Array<any>): string {
  return `[${array.map(stringify).join(", ")}]`;
}
