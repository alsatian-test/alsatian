import "reflect-metadata";

export function Test(description?: string) {
  return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {

    // check if this has been registered as a test already
    let tests: Array<string> = Reflect.getMetadata("alsatian:tests", target);

    // if there are no tests registered yet then register it
    if (!tests) {
      tests = [ propertyKey ];
      Reflect.defineMetadata("alsatian:tests", tests, target);
    }
    // otherwise add it to the register
    else if (tests.indexOf(propertyKey) === -1) {
      tests.push(propertyKey);
      Reflect.defineMetadata("alsatian:tests", tests, target);
    }
  }
}
