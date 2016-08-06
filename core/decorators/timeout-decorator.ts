import "reflect-metadata";

export function Timeout(timeoutInMs: number) {
  if (timeoutInMs <= 0) {
     throw new RangeError("Timeout period must be greater than 0.");
  }

  return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {

    Reflect.defineMetadata("alsatian:timeout", timeoutInMs, target, propertyKey);
  };
}
