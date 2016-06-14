import "reflect-metadata";

export function AsyncTest(description?: string) {
   return  (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<(...args: any[]) => any/*Promise<void>*/>) => {

      // check if this has been registered as a test already
      let tests: Array<any> = Reflect.getMetadata("alsatian:tests", target);

      // if there are no tests registered yet then register it
      if (!tests) {
         tests = [ {
            key: propertyKey,
            isAsync: true
         } ];
         Reflect.defineMetadata("alsatian:tests", tests, target);
      }
      // otherwise add it to the register if it's not already there
      else if (tests.filter(test => test.key === propertyKey).length === 0) {
         tests.push( {
            key: propertyKey,
            isAsync: true
         } );
         Reflect.defineMetadata("alsatian:tests", tests, target);
      }
      // otherwise mark it as async
      else {
         tests.filter(test => test.key === propertyKey)[0].isAsync = true;
      }
   };
}
