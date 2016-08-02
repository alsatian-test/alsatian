import "reflect-metadata";

export function Timeout(timeoutInMs: number) {
  if (timeoutInMs <= 0) {
     throw new RangeError("Timeout period must be greater than 0.");
  }
  
  return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {


    // check if this has been registered as a test already
    let tests: Array<any> = Reflect.getMetadata("alsatian:tests", target);

    // if there are no tests registered yet then register it
    if (!tests) {
      tests = [ {
         key: propertyKey
      } ];
      Reflect.defineMetadata("alsatian:tests", tests, target);
    }
    // otherwise add it to the register
    else if (tests.filter(test => test.key === propertyKey).length === 0) {
      tests.push( {
         key: propertyKey
      });
      Reflect.defineMetadata("alsatian:tests", tests, target);
    }

    tests.filter(test => test.key === propertyKey)[0].timeout = timeoutInMs;
};
}
