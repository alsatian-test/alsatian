import { IGNORE, IGNORE_REASON } from "./_metadata-keys";

export function Ignore<T>(reason: string) {
  return (
    target: T | (new (...args: Array<any>) => T),
    propertyKey?: string | symbol,
    descriptor?: TypedPropertyDescriptor<T>
  ) => {
    if (propertyKey) {
      // mark test method as ignored
      Reflect.defineMetadata(IGNORE, true, target, propertyKey);

      // add the reason
      Reflect.defineMetadata(IGNORE_REASON, reason, target, propertyKey);
    } else {
      // mark test method as ignored
      Reflect.defineMetadata(IGNORE, true, target);

      // add the reason
      Reflect.defineMetadata(IGNORE_REASON, reason, target);
    }
  };
}
